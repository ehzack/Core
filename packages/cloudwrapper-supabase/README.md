# @quatrain/cloudwrapper-supabase

This package provides a Cloud Wrapper adapter for Supabase Edge Functions. It allows you to invoke serverless functions in a consistent way across different BaaS providers.

## Features

-  Invokes Supabase Edge Functions.
-  Consistent interface provided by `@quatrain/cloudwrapper`.
-  Works with both SaaS and self-hosted Supabase instances.

## Installation

```bash
npm install @quatrain/cloudwrapper-supabase @supabase/supabase-js
```

## Usage

```typescript
import { CloudWrapper } from '@quatrain/cloudwrapper'
import { SupabaseCloudWrapperAdapter } from '@quatrain/cloudwrapper-supabase'

// Setup and use the adapter with the CloudWrapper singleton.
```
