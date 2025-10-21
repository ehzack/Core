# @quatrain/backend-sqlite

A backend adapter for SQLite. This package is perfect for local development, testing, and small-scale applications that require a simple, file-based database.

## Features

-  Implements the `@quatrain/backend` abstract adapter.
-  Zero-configuration setup for rapid development.
-  Stores the entire database in a single file.
-  Uses the `better-sqlite3` library for performance.

## Installation

```bash
npm install @quatrain/backend-sqlite better-sqlite3
```

## Usage

```typescript
import { Backend } from '@quatrain/backend'
import { SqliteAdapter } from '@quatrain/backend-sqlite'

const adapter = new SqliteAdapter({ config: { filename: './dev.db' } })
Backend.addAdapter(adapter, 'default', true)
```
