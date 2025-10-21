# @quatrain/auth-supabase

An authentication adapter for Supabase Auth. This package provides a seamless integration between Quatrain and Supabase's GoTrue-based authentication service.

## Features

-  Implements the `@quatrain/auth` abstract adapter.
-  Works with both Supabase SaaS and self-hosted instances.
-  Leverages Supabase's Row-Level Security (RLS) for data access.
-  Uses the `@supabase/supabase-js` library.

## Installation

```bash
npm install @quatrain/auth-supabase @supabase/supabase-js
```

## Usage

```typescript
import { Auth } from '@quatrain/auth'
import { SupabaseAuthAdapter } from '@quatrain/auth-supabase'

const adapter = new SupabaseAuthAdapter({
   config: { url: '...', anonKey: '...' },
})
Auth.addAdapter(adapter, 'default', true)
```
