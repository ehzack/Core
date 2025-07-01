import { User, PersistedBaseObject } from '@quatrain/backend'
import { Entity as CoreEntity } from '@quatrain/core'
import { SQLiteAdapter } from '../SQLiteAdapter'

// Create a simple Entity class that extends PersistedBaseObject for testing
class Entity extends PersistedBaseObject {
   static COLLECTION = 'entities'
   static PROPS_DEFINITION = CoreEntity.PROPS_DEFINITION

   static async factory(src: any = undefined): Promise<Entity> {
      return super.factory(src, Entity)
   }
}

export const setup = (dbPath: string = ':memory:') => {
   return new SQLiteAdapter({
      config: {
         database: dbPath
      },
   })
}

export const createUser = async () => {
   const user = await User.factory()
   user._.firstname = 'John'
   user._.lastname = 'Doe'
   user._.email = 'john@doe.com'
   user._.password = 'password123'

   return user
}

export const createEntity = async () => {
   const entity = await Entity.factory()
   entity._.name = 'ACME Inc.'

   return entity
}

export const createUsers = async (
   userModel: User,
   qty: number = 5,
   forcedValues: any = {}
): Promise<User[]> => {
   // Simple data generator since utils.DataGenerator is not available
   const users: User[] = []
   for (let i = 0; i < qty; i++) {
      const user = await User.factory()
      user._.firstname = forcedValues.firstname || `User${i}`
      user._.lastname = forcedValues.lastname || 'Test'
      user._.email = forcedValues.email || `user${i}@test.com`
      user._.password = forcedValues.password || 'password'
      if (forcedValues.entity) {
         user._.entity = forcedValues.entity
      }
      users.push(user)
   }
   return users
}

export { Entity }