# @quatrain/cloudwrapper-firebase

This package provides a Cloud Wrapper adapter for Firebase Functions. It allows you to invoke serverless functions in a consistent way across different BaaS providers.

## Features

-  Invokes Firebase Functions (2nd gen).
-  Consistent interface provided by `@quatrain/cloudwrapper`.
-  Uses the Firebase Admin SDK for secure, server-to-server calls.

## Installation

```bash
npm install @quatrain/cloudwrapper-firebase firebase-admin
```

## Usage

```typescript
import { CloudWrapper } from '@quatrain/cloudwrapper'
import { FirebaseCloudWrapperAdapter } from '@quatrain/cloudwrapper-firebase'

// Setup and use the adapter with the CloudWrapper singleton.
```
