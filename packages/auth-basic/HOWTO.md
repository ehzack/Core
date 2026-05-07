# How To: Using @quatrain/auth-basic

This guide covers how to set up Basic HTTP Authentication for your Quatrain API servers.

## Table of Contents
1. [Basic Usage](#1-basic-usage)
2. [Integration in Core Studio](#2-integration-in-core-studio)

---

## 1. Basic Usage

You can protect any Quatrain API server by initializing the `AuthBasic` adapter and injecting its middleware into your `ServerAdapter`.

```typescript
import { ExpressAdapter } from '@quatrain/api-server-express'
import { AuthBasic } from '@quatrain/auth-basic'
import { Api } from '@quatrain/api'

// 1. Initialize your server adapter
const server = new ExpressAdapter(undefined, { apiPrefix: '/api' })
Api.addServer(server, 'default')

// 2. Initialize Basic Auth with credentials
const basicAuth = AuthBasic.factory(process.env.ADMIN_USER, process.env.ADMIN_PASS)

// 3. Attach the middleware to your server instance
if (basicAuth) {
   server.addMiddleware(basicAuth.middleware())
}
```

## 2. Integration in Core Studio

In Core Studio, you can easily protect your deployment without writing any code. Just define the `STUDIO_AUTH_USER` and `STUDIO_AUTH_PASS` environment variables.

For example, in your `compose.yaml` file:
```yaml
services:
  studio-api:
    image: ghcr.io/quatrain/studio-image:latest
    environment:
      - STUDIO_AUTH_USER=admin
      - STUDIO_AUTH_PASS=supersecret
```

The server will automatically detect these variables and enable Basic Authentication for all incoming requests as a fallback to the dynamic authentication loading.
