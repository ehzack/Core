# @quatrain/core

The foundation of the Quatrain framework. This package provides the base components for building business objects and defining data models. It works entirely in-memory and has no persistence dependencies.

## Features

-  **Base Objects**: `BaseObject`, `AbstractObject`, `DataObject` for in-memory object management.
-  **Built-in Models**: `User` and `Entity` models with full property definitions.
-  **Property System**: Strongly-typed properties with built-in validation (`StringProperty`, `NumberProperty`, etc.).
-  **Object URI**: A unified resource identification system that works with or without a database.
-  **Status Management**: Built-in lifecycle statuses (`created`, `pending`, `active`, `deleted`).

## Installation

```bash
npm install @quatrain/core
```

## Usage

This package is designed to be used as the base for all other Quatrain packages. You can define your data models and business logic without needing a database connection.

```typescript
import { BaseObject, StringProperty } from '@quatrain/core'

export class Product extends BaseObject {
   static COLLECTION = 'products'
   static PROPS_DEFINITION = [
      { name: 'name', type: StringProperty.TYPE, mandatory: true },
      { name: 'sku', type: StringProperty.TYPE, mandatory: true },
   ]
}

const product = await Product.factory()
product._.name = 'My Awesome Product'
console.log(product.isValid()) // true
```
