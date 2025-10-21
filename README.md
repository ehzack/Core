<!--
Hello! You've found the README for the Quatrain Core monorepo.
For a more detailed overview of each package, please see PACKAGES_OVERVIEW.md.
-->

# Quatrain Core - A Modular BaaS Framework

Quatrain Core is a modular TypeScript framework designed to accelerate business application development with **Backend as a Service (BaaS)** solutions like Firebase and Supabase. It provides a clean separation of concerns between logic, data, and storage, using an adapter pattern to provide consistent interfaces across different BaaS providers.

## 🎯 Core Principles

-  **BaaS-First Architecture**: Built to leverage modern BaaS platforms like Firebase and Supabase for managed databases, authentication, storage, and serverless functions.
-  **Clean Abstraction**: Write your business logic once. The adapter pattern allows you to switch between different backend services (e.g., Firestore, PostgreSQL, Firebase Auth, Supabase Auth) with minimal code changes.
-  **Deployment Flexibility**: While optimized for SaaS, Quatrain fully supports self-hosted solutions. For example, a Supabase-powered application can be deployed via Docker, Kubernetes, or on-premise for data sovereignty, using the exact same codebase.
-  **Modular by Design**: The framework is split into scoped packages. Use only what you need, from core object modeling to authentication, storage, and message queues.
-  **Standalone Core**: The `@quatrain/core` package works entirely in-memory for defining models, validation, and business logic, without requiring any database connection.

## 🏗️ Architecture & Packages

The framework is organized as a monorepo with a foundation package and a suite of adapters for popular services.

```bash
@quatrain/core (Foundation - works standalone)
├── 🔥 Firebase Ecosystem
│   ├── @quatrain/backend-firestore (Firestore NoSQL)
│   ├── @quatrain/auth-firebase (Firebase Auth)
│   ├── @quatrain/storage-firebase (Firebase Storage)
│   └── @quatrain/cloudwrapper-firebase (Firebase Functions)
├── 🟢 Supabase Ecosystem
│   ├── @quatrain/backend-postgres (PostgreSQL - works with Supabase)
│   ├── @quatrain/auth-supabase (Supabase Auth)
│   ├── @quatrain/storage-supabase (Supabase Storage)
│   └── @quatrain/cloudwrapper-supabase (Supabase Edge Functions)
├── 📊 Traditional Backends (for migration/hybrid scenarios)
│   ├── @quatrain/backend-sqlite (Local development)
│   └── @quatrain/storage-s3 (S3-compatible storage)
├── 📬 Message Queues (for complex workflows)
│   ├── @quatrain/queue-amqp (RabbitMQ)
│   ├── @quatrain/queue-aws (AWS SQS)
│   └── @quatrain/queue-gcp (Google Pub/Sub)
├── @quatrain/log (Structured logging)
└── @quatrain/worker (Background processing)
```

## How to use

### Create a model

```ts
import { BaseObject, Property } from '@quatrain/core'

export type Cat = {
   name: string
   color: `#${string}`
}

export class CatCore extends BaseObject {
   static COLLECTION = 'cats'

   static PROPERTIES = [
      {
         name: 'name',
         type: Property.STRING,
         minLength: 1,
         maxLength: 32,
      },
      {
         name: 'color',
         type: Property.STRING,
         minLength: 4,
         maxLength: 7,
      },
   ]
}
```

### Instantiate a model

```ts
const catData: Cat = {
   name: 'Garfield',
   color: '#ffa502',
}

const garfield = Cat.fromObject(catData)

console.log(garfield._.name)
// > "Garfield"
console.log(garfield._.color)
// > "#ffa502"
```

### Interact with backend

```ts
import { Backend } from '@quatrain/backend'
import { SqliteAdapter } from '@quatrain/backend-sqlite'

// Set up a default backend
Backend.addBackend(new SqliteAdapter(), 'sqlite', true)

// Let's save Garfield in our database
const savedCat = await garfield.save()

// Now, let's retrieve Garfield in the database
const persistedGarfield = await Cat.fromBackend(savedCat.path)
// cats/xyz
```

### Using repositories

You can use repositories as an alternative way to persist and retrieve models in your backend.

This module provides a BaseRepository class that you can extend and override to apply your business logic when doing backend operations.

Let's create a repository for our Cat model, that prevents us from deleting a cat.

```ts
import { BackendInterface, BaseRepository } from '@quatrain/backend'

export default class CatRepository extends BaseRepository<Cat> {
   constructor(backendAdapter: BackendInterface = Backend.getBackend()) {
      super(Cat, backendAdapter)
   }

   async delete(uid: string) {
      throw Error("Don't delete the cats!")
   }
}
```

Now, let's use our new CatRepository.

```ts
const repository = new CatRepository()

repository.create(garfield)
repository.read('garfield')
repository.update(persistedGarfield)
repository.delete('garfield') // Will throw "Don't delete the cats!"
```
