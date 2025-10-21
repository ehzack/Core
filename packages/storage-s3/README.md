# @quatrain/storage-s3

A storage adapter for AWS S3 and other S3-compatible services like MinIO or DigitalOcean Spaces.

## Features

-  Implements the `@quatrain/storage` abstract adapter.
-  Works with any S3-compatible object storage provider.
-  Leverages the official AWS SDK for JavaScript (`@aws-sdk/client-s3`).
-  Supports multipart uploads for large files.

## Installation

```bash
npm install @quatrain/storage-s3 @aws-sdk/client-s3
```

## Usage

```typescript
import { Storage } from '@quatrain/storage';
import { S3StorageAdapter } from '@quatrain/storage-s3';

const adapter = new S3StorageAdapter({ config: { region: 'us-east-1', credentials: { ... } } });
Storage.addAdapter(adapter, 'default', true);
```
