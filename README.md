<div align="center">
  <img src="./assets/logo.png" alt="Quatrain Logo" width="300" />
</div>

# Quatrain Core - A Modular BaaS Framework

> **"Business Logic outlives Infrastructure"**

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Quatrain_Core&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Quatrain_Core)

Quatrain Core is a modular TypeScript framework designed to accelerate business application development with **Backend as a Service (BaaS)** solutions like Firebase and Supabase. It provides a clean separation of concerns between logic, data, and storage, using an adapter pattern to provide consistent interfaces across different BaaS providers.

## 🎯 Core Principles

-  **BaaS-First Architecture**: Built to leverage modern BaaS platforms like Firebase and Supabase for managed databases, authentication, storage, and serverless functions.
-  **Clean Abstraction**: Write your business logic once. The adapter pattern allows you to switch between different backend services (e.g., Firestore, PostgreSQL, Firebase Auth, Supabase Auth) with minimal code changes.
-  **Deployment Flexibility**: While optimized for SaaS, Quatrain fully supports self-hosted solutions. For example, a Supabase-powered application can be deployed via Docker, Kubernetes, or on-premise for data sovereignty, using the exact same codebase.
-  **Modular by Design**: The framework is split into scoped packages. Use only what you need, from core object modeling to authentication, storage, and message queues.
-  **Standalone Core**: The `@quatrain/core` package works entirely in-memory for defining models, validation, and business logic, without requiring any database connection.

## 🧠 Philosophy

Quatrain Core is built upon three foundational pillars to ensure enterprise-grade reliability and longevity:

- **Sovereignty by Design**: Deploy anywhere, from your local laptop to the largest hyperscalers (AWS, GCP, Azure). Quatrain's adapter pattern prevents vendor lock-in, ensuring you retain total control over your data and infrastructure choices.
- **Cybersecurity by Design**: We rely on rock-solid, audited, and widely adopted components. By keeping the core architecture simple and maintainable, we reduce the attack surface and make security patching straightforward.
- **Cloud-Native Best Practices**: Designed to build robust applications that withstand the test of time. Quatrain embraces stateless execution, ephemeral environments, and seamless horizontal scaling to effortlessly adapt to technological innovations.

---

## 📐 1. Design

The Design phase is all about modeling your domain and laying the foundations of your application without worrying about the underlying database or UI framework logic.

### Core Ecosystem
- **`@quatrain/core`**: Foundation package. Works standalone in-memory. Defines models, properties, validation, and serialization.
- **`@quatrain/studio` & `apps/studio-web`**: Visual interface and meta-modeling tools to dynamically design and generate your application schemas.
- **`@quatrain/ui`**: Core styling and component logic (Mantine-based) for consistent frontend experiences.

### Modeling Example
Use `BaseObject` for in-memory data modeling without any database-related methods.

```ts
import { BaseObject, Property } from '@quatrain/core'

export class Cat extends BaseObject {
   static COLLECTION = 'cats'
   static PROPERTIES = [
      { name: 'name', type: Property.STRING, minLength: 1, maxLength: 32 },
      { name: 'color', type: Property.STRING, minLength: 4, maxLength: 7 },
   ]
}

const garfield = Cat.fromObject({ name: 'Garfield', color: '#ffa502' })
console.log(garfield._.name) // > "Garfield"
```

---

## 🛠️ 2. Development

During Development, you connect your business logic to services such as databases, authentication, AI, and message queues, using interchangeable adapters.

### Backend & Service Ecosystem
- **Database Adapters**: `@quatrain/backend`, `@quatrain/backend-firestore`, `@quatrain/backend-postgres`, `@quatrain/backend-sqlite`
- **Authentication**: `@quatrain/auth`, `@quatrain/auth-firebase`, `@quatrain/auth-supabase`, `@quatrain/auth-oidc`, `@quatrain/auth-pocketbase`
- **Storage**: `@quatrain/storage`, `@quatrain/storage-firebase`, `@quatrain/storage-supabase`, `@quatrain/storage-local`, `@quatrain/storage-s3`
- **Queueing & Messaging**: `@quatrain/queue`, `@quatrain/queue-amqp`, `@quatrain/queue-aws`, `@quatrain/queue-gcp`, `@quatrain/messaging`, `@quatrain/messaging-firebase`
- **AI & Automation**: `@quatrain/ai`, `@quatrain/ai-gemini`, `@quatrain/app`, `@quatrain/code`, `@quatrain/code-github`
- **Testing**: `@quatrain/testing`

### Persistence Example
To interact with a database, models inherit from `PersistedBaseObject`. You can then use the `Backend` adapter of your choice.

```ts
import { Backend, PersistedBaseObject } from '@quatrain/backend'
import { SqliteAdapter } from '@quatrain/backend-sqlite'

export class PersistedCat extends PersistedBaseObject {
   static COLLECTION = 'cats'
   static PROPERTIES = [ /* ... */ ]
}

// Set up a backend adapter
Backend.addBackend(new SqliteAdapter(), 'sqlite', true)

// Instantiate and save
const garfield = PersistedCat.fromObject({ name: 'Garfield', color: '#ffa502' })
await garfield.save()

// Retrieve
const retrievedGarfield = await PersistedCat.fromBackend(garfield.asReference().path)
```

---

## 🚀 3. Deployment

Deployment covers running your code, scaffolding new environments, configuring API gateways, and handling data migrations. 

### Deployment & Infrastructure Ecosystem
- **CLI & Code Generation**: `@quatrain/core-cli` (Scaffolds projects, configurations, and migrations)
- **Migrations**: `@quatrain/backend-migrations` (Schema and data migration tooling)
- **Cloud Wrappers**: `@quatrain/cloudwrapper`, `@quatrain/cloudwrapper-firebase`, `@quatrain/cloudwrapper-supabase` (Serverless/Edge functions handling)
- **Containers**: Includes pre-configured Docker/Podman setups like `api-gateway` and `studio-api`.

### Scaffolding & Migrations Example
Use the CLI to quickly bootstrap a project or generate configurations:

```bash
# Scaffold a new project
quatrain generate scaffold my-app

# Generate a unified quatrain.json config
quatrain generate config
```

Running migrations on your deployment target:

```typescript
import { MigrationManager } from '@quatrain/backend-migrations'

const manager = new MigrationManager('./migrations')
await manager.run()
```

---

## 🔮 Upcoming

The Quatrain ecosystem is constantly evolving to empower developers and business users alike. Our roadmap includes:

- **Quatrain Studio**: A complete, visual interface to design and manage your entire application ecosystem. This studio will be driven by the user and seamlessly assisted by a Large Language Model (LLM) to accelerate scaffolding, modeling, and repetitive tasks.
- **BPM & State Machines**: A powerful Business Process Management (BPM) engine allowing you to manage complex business logic and entity lifecycles through robust, visual "State Machines".

---

## ⚖️ License & Professional Services

Quatrain Core is released under the **AGPL-3.0** (Affero General Public License). This ensures that any enhancements to the open-source core remain free and accessible to the community. If you build a SaaS or application using this framework, you must comply with the AGPL-3.0 terms.

**Professional Services & Commercial Licensing**  
If your organization requires a commercial license (to integrate Quatrain Core without the AGPL-3.0 restrictions), or if you need expert assistance, the **Quatrain** team offers:
- **Commercial Licensing**: Tailored licenses for proprietary software and enterprise deployments.
- **Custom Development**: Expert engineers to help you build or migrate your backend architecture.
- **Premium Support**: Priority SLA, architectural consulting, and code reviews.

Contact us at **developers@quatrain.com** to discuss your project needs.
