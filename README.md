# Quatrain Core

## Why

Quatrain Core is an abstraction layer designed to accelerate and simplify the development
of applications using many models and various data stores, being database or APIs.

With Quatrain Core and peer packages, one may develop robust applications based on
Oriented Object Programming with a clear separation of concerns between logic, data
and storage.

## How to install

```bash
yarn install @quatrain/core
```

Quatrain Core comes with a built-in Mock backend adapter. Other adapters are available in
different packages. For example, a Google Firestore adapter is available:

```bash
yarn install @quatrain/backend-firestore
```

## How to use

### Setup

```ts
import { Core } from '@quatrain/core'

Core.addBackend(myAdapter, 'myDB', true)
```

### Create a model

```ts
import { BaseObjectCore } from '@quatrain/core'

export type Cat = {
   name: string
   color: `#${string}`
}

export class CatCore extends BaseObjectCore {
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

const garfield = CatCore.fromObject(catData)

console.log(garfield.name)
// > "Garfield"
console.log(garfield.color)
// > "#ffa502"
console.log(garfield.core)
// > CatCore { ... }
```

### Interact with backend

```ts
// Let's save Garfield in our database
garfield.core.save()

// Now, let's retrieve Garfield in the database
const persistedGarfield = await CatCore.fromBackend('garfield')
```

### Using repositories

You can use repositories as an alternative way to persist and retrieve models in your backend.

This module provides a BaseRepository class that you can extend and override to apply your business logic when doing backend operations.

Let's create a repository for our Cat model, that prevents us from deleting a cat.

```ts
import { Core, BackendInterface, BaseRepository } from '@quatrain/core'

export default class CatRepository extends BaseRepository<Cat> {
   constructor(backendAdapter: BackendInterface = Core.getBackend()) {
      super(CatCore, backendAdapter)
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
