# @quatrain/auth-firebase

An authentication adapter for Firebase Authentication. This package integrates Quatrain's auth system with Google's managed authentication service.

## Features

-  Implements the `@quatrain/auth` abstract adapter.
-  Supports email/password, social logins (Google, Facebook, etc.), and custom tokens.
-  Integrates with Firebase security rules.
-  Uses the `firebase-admin` SDK for server-side operations.

## Installation

```bash
npm install @quatrain/auth-firebase firebase-admin
```

## Usage

```typescript
import { Auth } from '@quatrain/auth'
import { FirebaseAuthAdapter } from '@quatrain/auth-firebase'

const adapter = new FirebaseAuthAdapter({
   config: {
      /* Firebase Admin SDK config */
   },
})
Auth.addAdapter(adapter, 'default', true)
```
