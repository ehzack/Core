# @quatrain/storage-firebase

A storage adapter for Google Cloud Storage for Firebase. This package allows Quatrain applications to store and manage user-generated content like images and videos.

## Features

-  Implements the `@quatrain/storage` abstract adapter.
-  Integrates with Firebase security rules for fine-grained access control.
-  Automatic CDN distribution for low-latency content delivery.
-  Uses the `firebase-admin` SDK for server-side operations.

## Installation

```bash
npm install @quatrain/storage-firebase firebase-admin
```

## Usage

```typescript
import { Storage } from '@quatrain/storage'
import { FirebaseStorageAdapter } from '@quatrain/storage-firebase'

const adapter = new FirebaseStorageAdapter({
   config: {
      /* Firebase Admin SDK config */
   },
})
Storage.addAdapter(adapter, 'default', true)
```
