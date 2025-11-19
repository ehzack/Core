# @quatrain/cloudwrapper-supabase

This package provides a Cloud Wrapper adapter for Supabase Edge Functions. It allows you to invoke serverless functions in a consistent way across different BaaS providers.
This package provides a Cloud Wrapper for Supabase, enabling real-time database and storage triggers. It handles the WebSocket connection to Supabase's Realtime service, providing robust connection monitoring and configurable automatic reconnection logic.

## Features

- Listens to database changes (`INSERT`, `UPDATE`, `DELETE`) on your Supabase Postgres database.
- Listens to storage changes in Supabase Storage.
- Monitors connection health with a heartbeat mechanism.
- Provides a configurable strategy for handling disconnections (exit process or attempt to reconnect).
- Consistent interface provided by `@quatrain/cloudwrapper`.
- Works with both SaaS and self-hosted Supabase instances.

## Installation

```bash
# With npm
npm install @quatrain/cloudwrapper-supabase @supabase/supabase-js

# With yarn
yarn add @quatrain/cloudwrapper-supabase @supabase/supabase-js
```

## Usage

```typescript
import { CloudWrapper } from '@quatrain/cloudwrapper'
import { SupabaseCloudWrapperAdapter } from '@quatrain/cloudwrapper-supabase'
import { SupabaseCloudWrapper } from '@quatrain/cloudwrapper-supabase'
import { BackendAction } from '@quatrain/backend'

// Setup and use the adapter with the CloudWrapper singleton.
const wrapper = new SupabaseCloudWrapper({
   url: process.env.SUPABASE_URL,
   key: process.env.SUPABASE_KEY,
   // Optional: Determines behavior on disconnection.
   // - true (default): Exits the process. Ideal for containerized environments
   //   (e.g., Kubernetes) that will automatically restart the service.
   // - false: Attempts to reconnect internally.
   exitOnDisconnect: true,
})

// Example: Set up a trigger for new rows in a 'profiles' table
wrapper.databaseTrigger({
   name: 'new-profile-trigger',
   model: 'profiles',
   event: BackendAction.CREATE,
   script: async ({ after }) => {
      console.log(`A new profile was created:`, after)
      // Add your business logic here
   },
})
```
