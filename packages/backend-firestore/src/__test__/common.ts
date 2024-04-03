import { Core, Entity, User } from '@quatrain/core'
import { FirestoreAdapter } from '../FirestoreAdapter'
import { CollectionHierarchy } from '@quatrain/core/lib/backends'
import { faker } from '@faker-js/faker'

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:4141'

export const setup = () => {
   Core.addBackend(
      new FirestoreAdapter({
         config: {
            projectId: 'quatrain-core-firestore-admin-adapter-test',
            databaseURL: 'http://127.0.0.1:4141',
         },
         hierarchy: { alerts: CollectionHierarchy.SUBCOLLECTION },
      }),
      '@default'
   )

   return Core.getBackend()
}

export const createUser = async () => {
   const user = await User.factory({
      firstname: 'John',
      lastname: 'Doe',
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'azerty',
   })

   return user
}

export const createEntity = async () => {
   const entity = await Entity.factory()
   entity._.name = 'ACME Inc.'

   return entity
}

export const createUsers = async (qty: number = 5, forcedValues: any = {}) => {
   const users: Array<User> = []
   for (let i = 0; i < qty; i++) {
      const firstname = forcedValues.firstname || faker.name.firstName()
      const lastname = forcedValues.lastname || faker.name.lastName()

      const user = await User.factory({
         firstname: firstname,
         lastname: lastname,
         name: forcedValues.name || `${firstname} ${lastname}`,
         email:
            forcedValues.email || faker.helpers.unique(faker.internet.email),
         password: forcedValues.password || 'password',
         entity: forcedValues.entity || undefined,
      })

      await Core.getBackend().create(user.dataObject)

      users.push(user)
   }

   return users
}
