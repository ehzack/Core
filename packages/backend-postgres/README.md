# @quatrain/backend-postgres

A backend adapter for PostgreSQL. This package is optimized for use with Supabase but works with any standard PostgreSQL database.

## Features

-  Implements the `@quatrain/backend` abstract adapter.
-  Full SQL support for complex queries, transactions, and joins.
-  Uses the `pg` (node-postgres) library for high performance.
-  Includes scripts and guidance for setting up the required database schema.

## Installation

```bash
npm install @quatrain/backend-postgres pg
```

## Usage

```typescript
import { Backend } from '@quatrain/backend'
import { PostgresAdapter } from '@quatrain/backend-postgres'

const adapter = new PostgresAdapter({ config: { connectionString: '...' } })
Backend.addAdapter(adapter, 'default', true)
```
