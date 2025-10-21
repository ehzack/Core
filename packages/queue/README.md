# @quatrain/queue

This package provides message queue abstractions for building scalable, asynchronous applications. It allows you to decouple services and process background jobs efficiently.

## Features

-  **Abstract Adapter**: A consistent interface for different message brokers (RabbitMQ, AWS SQS, etc.).
-  **Publish/Subscribe**: Send messages to queues or topics.
-  **Worker Pattern**: Easily create consumers to process messages from a queue.

## Installation

```bash
npm install @quatrain/queue
```

## Usage

This package requires a concrete queue adapter, such as `@quatrain/queue-amqp`.

```typescript
import { Queue } from '@quatrain/queue'

// Assuming an adapter has been added
await Queue.publish('email-queue', {
   to: 'user@example.com',
   subject: 'Welcome!',
})

Queue.subscribe('email-queue', async (message) => {
   /* ... process message ... */
})
```
