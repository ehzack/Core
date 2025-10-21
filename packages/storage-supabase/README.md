# @quatrain/storage-supabase

A storage adapter for Supabase Storage. This package allows Quatrain to use Supabase for S3-compatible object storage.

## Features

-  Implements the `@quatrain/storage` abstract adapter.
-  Works with both Supabase SaaS and self-hosted instances.
-  Integrates with Supabase's policies for fine-grained file access control.
-  Uses the `@supabase/supabase-js` library.

## Installation

```bash
npm install @quatrain/storage-supabase @supabase/supabase-js
```

## Usage

```typescript
import { Storage } from '@quatrain/storage'
import { SupabaseStorageAdapter } from '@quatrain/storage-supabase'

const adapter = new SupabaseStorageAdapter({
   config: { url: '...', anonKey: '...' },
})
Storage.addAdapter(adapter, 'default', true)
```
