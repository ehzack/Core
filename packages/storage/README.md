# @quatrain/storage

This package provides file storage abstractions for various cloud providers. It offers a unified API for file operations like uploads, downloads, and deletions.

## Features

-  **Abstract Adapter**: A common interface for different storage backends (S3, Firebase Storage, etc.).
-  **File Operations**: Simple API for `create`, `read`, `delete`, `copy`, and `move`.
-  **Stream Support**: Efficiently handle large files using streams.
-  **Metadata Management**: Attach and retrieve metadata for stored files.

## Installation

```bash
npm install @quatrain/storage
```

## Usage

This package requires a concrete storage adapter, like `@quatrain/storage-s3` or `@quatrain/storage-firebase`.

```typescript
import { Storage } from '@quatrain/storage'
import { FirebaseStorageAdapter } from '@quatrain/storage-firebase'

// Assuming an adapter has been added
const file = await Storage.create({
   name: 'avatar.jpg',
   path: 'users/uid123/',
   buffer: fileBuffer,
})
const downloadedFile = await Storage.read(file.path)
```
