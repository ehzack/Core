import { User, PersistedBaseObject } from '@quatrain/backend'
import { Entity as CoreEntity } from '@quatrain/core'

/**
 * A mock persisted entity used across unit and integration tests.
 * Extends `PersistedBaseObject` to simulate database interactions.
 */
export class Entity extends PersistedBaseObject {
   /** The mock collection name where this entity would be stored. */
   static COLLECTION = 'entities'
   /** The schema definition inherited from `CoreEntity`. */
   static PROPS_DEFINITION = CoreEntity.PROPS_DEFINITION

   /**
    * Instantiates a new test `Entity` with optional mock data.
    * 
    * @param src - Initial mock data or object URI.
    * @returns A promise resolving to the instantiated entity.
    */
   static async factory(src: any = undefined): Promise<Entity> {
      return super.factory(src, Entity)
   }
}

export const createUser = async () => {
   const user = await User.factory()
   user._.firstname = 'John'
   user._.lastname = 'Doe'
   user._.email = 'john@doe.com'
   user._.password = 'password123' // NOSONAR

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
