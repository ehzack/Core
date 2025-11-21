# Supabase Cloud Wrapper Package

## Introduction

This package provides a Cloud Wrapper for Supabase, enabling real-time database
and storage triggers. It handles the WebSocket connection to Supabase's Realtime
service, providing robust connection monitoring and configurable automatic reconnection logic.

## Features

-  Listens to database changes (`INSERT`, `UPDATE`, `DELETE`) on your Supabase Postgres database.
-  Listens to storage changes in Supabase Storage.
-  Monitors connection health with a heartbeat mechanism.
-  Provides a configurable strategy for handling disconnections (exit process or attempt to reconnect).
-  Consistent interface provided by `@quatrain/cloudwrapper`.
-  Works with both SaaS and self-hosted Supabase instances.

## Installation

```bash
# With npm
npm install @quatrain/cloudwrapper-supabase

# With yarn
yarn add @quatrain/cloudwrapper-supabase
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
   // - `true` (default): Exits the process. Ideal for containerized
   //   environments (e.g., Kubernetes) that will automatically restart the service.
   // - `false`: Attempts to reconnect internally.
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

### Callback Payload

The `script` callback for both `databaseTrigger` and `storageTrigger` receives
an object with the following properties:

-  `after`: The new state of the record after the event. For `DELETE` events, this will be an empty object.
-  `before`: The state of the record before the event. For `INSERT` events, this will be an empty object.
-  `context`: An object containing additional metadata about the event, such as
   the schema, table, and commit timestamp provided by Supabase's Realtime service.

For `storageTrigger`, the `before` and `after` properties are transformed into a
`FileType` object, providing a standardized format for file metadata.
