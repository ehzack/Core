# RFC: Optimistic Concurrency Control (OCC) & Conflict Detection in Quatrain Core

**Status:** Draft / Proposal  
**Scope:** `@quatrain/backend`, `@quatrain/backend-postgres`, `@quatrain/backend-sqlite`, `@quatrain/backend-firestore`  
**Author:** Totalymage Architecture Team / Gemini Agent  
**Date:** September 2026  

---

## 1. Context & Problem Statement

In distributed, asynchronous, and worker-driven microservice architectures (such as video transcoding workers, AI pipelines, and storage triggers running in parallel):

1. **Service A** (e.g. `storageParser` trigger) reads a record `doc` at $t_0$.
2. **Service B** (e.g. `videoptim-worker`) finishes a job at $t_1$ and commits updated metadata (transcoding stats, dimensions, duration, status: `COMPLETED`).
3. **Service A** finishes slow operations (e.g. streaming MD5 checksum calculation, thumbnail extraction) at $t_2$ and calls `repository.update(doc)` using the stale snapshot loaded at $t_0$.
4. **Consequence:** Service A performs a blind `UPDATE ... WHERE id = $id`, completely overwriting Service B's updates. Metadata is lost, and the record's status is reverted to a stale state (e.g. back to `TRIAGING`).

Currently, `AbstractBackendAdapter` and `PostgresAdapter.ts` perform unconditional updates:
```sql
UPDATE "table" SET field1 = $1, field2 = $2 WHERE id = '...';
```
There is no built-in detection of concurrent modifications between the `read()` and `update()` cycles.

---

## 2. Proposed Architecture & Solutions

### A. Solution 1: PostgreSQL Native `xmin` (Zero Schema Change)

PostgreSQL includes a native system pseudo-column on every row: `xmin`.  
`xmin` represents the internal Transaction ID (XID) that inserted or updated the row.

#### Workflow:
1. **Read:** In `PostgresAdapter.read()`, select `xmin`:
   ```sql
   SELECT coll.id, coll.xmin AS _xmin, ... FROM "collection" AS coll WHERE coll.id = $1;
   ```
   Store `_xmin` as internal metadata on `DataObjectClass` (e.g. `dataObject.setSystemProperty('_xmin', row._xmin)`).

2. **Update:** In `PostgresAdapter.update()`, append the `xmin` condition if present:
   ```sql
   UPDATE "collection" 
   SET field1 = $1, field2 = $2 
   WHERE id = $3 AND xmin = $cached_xmin
   RETURNING id;
   ```

3. **Detection:**
   If `result.rowCount === 0`:
   PostgreSQL rejected the update because another transaction touched the row.
   Throw a dedicated `ConcurrentModificationError`.

**Pros:**
- Zero database migrations required.
- Extremely lightweight, managed automatically by PostgreSQL MVCC engine.

**Cons:**
- Specific to PostgreSQL (not portable as-is to SQLite or Firestore without adaptation).

---

### B. Solution 2: Universal `updatedAt` / `_version` (Cross-Engine)

For cross-backend consistency (Postgres, SQLite, Firestore):

1. Standardize an optimistic concurrency property on `PersistedBaseObject`:
   - Either automatically tracked `updatedAt` (timestamp with millisecond precision).
   - Or a discrete integer `_version` incremented on each write (`_version = _version + 1`).
2. Conditional write in SQL:
   ```sql
   UPDATE "collection"
   SET field1 = $1, field2 = $2, updated_at = NOW()
   WHERE id = $3 AND updated_at = $original_updated_at;
   ```

---

## 3. High-Level API & Conflict Handling Policies

In `BaseRepository`:

```typescript
export interface UpdateOptions<T> {
   /**
    * If true, aborts immediately when a concurrent update is detected.
    * Default: false (backward-compatible) or true (in strict mode).
    */
   failFast?: boolean

   /**
    * Number of automatic retry attempts upon conflict.
    * Default: 0
    */
   retry?: number

   /**
    * Optional custom merger invoked during retries.
    * Allows combining changes between stale object and freshly loaded database state.
    */
   mergeResolver?: (staleObj: T, freshObj: T) => T | Promise<T>
}
```

### 1. Fail-Fast Strategy
When `failFast: true` is enabled:
```typescript
try {
   await repository.update(doc, { failFast: true })
} catch (err) {
   if (err instanceof ConcurrentModificationError) {
      // Reject or requeue job safely without overwriting concurrent work
   }
}
```

### 2. Auto-Retry Strategy
When `retry > 0`:
1. Catch `ConcurrentModificationError`.
2. Reload fresh entity: `freshObj = await repository.read(obj.uid)`.
3. If `mergeResolver` is provided, invoke it to merge modified fields.
4. Retry `repository.update(mergedObj)`.

---

## 4. Impacted Packages in Quatrain Core

| Package | Files | Changes Required |
|---|---|---|
| `@quatrain/core` | `errors/` | Add `ConcurrentModificationError` |
| `@quatrain/backend` | `DataObjectClass.ts`, `BaseRepository.ts`, `AbstractBackendAdapter.ts` | Add system metadata storage (`_xmin`/`_version`), update signature with `UpdateOptions`, retry loop logic |
| `@quatrain/backend-postgres` | `PostgresAdapter.ts` | Read `xmin`, add `WHERE xmin = $xmin` on update, check `rowCount` |
| `@quatrain/backend-sqlite` | `SqliteAdapter.ts` | Support `_version` / `updated_at` check on update |

---

## 5. Next Steps
1. Review and validate RFC with the Core maintainers.
2. Implement `ConcurrentModificationError` and `PostgresAdapter` `xmin` check in a feature branch.
3. Add unit tests simulating concurrent writes on the same record in `packages/backend-postgres/__test__/concurrency.test.ts`.
