# @quatrain/auth

This package provides authentication and authorization abstractions for Quatrain applications. It defines a consistent interface for managing users, sessions, and tokens across different authentication providers.

## Features

-  **Abstract Adapter**: A common interface for authentication providers.
-  **User Management**: Handles user registration, login, and profile updates.
-  **Token Handling**: Manages JWT verification and refresh logic.
-  **Middleware Integration**: Provides hooks for protecting backend routes.

## Installation

```bash
npm install @quatrain/auth
```

## Usage

This package is meant to be used with a concrete authentication adapter, such as `@quatrain/auth-firebase` or `@quatrain/auth-supabase`.

```typescript
import { Auth } from '@quatrain/auth'
import { SupabaseAuthAdapter } from '@quatrain/auth-supabase'

// Assuming an adapter has been added
const user = await Auth.register({
   email: 'user@example.com',
   password: 'password123',
})
const token = await Auth.login('user@example.com', 'password123')
```
