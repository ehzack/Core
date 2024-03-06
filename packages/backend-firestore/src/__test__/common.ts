import { Core, Entity, User, utils } from '@quatrain/core'
import { FirestoreAdapter } from '../FirestoreAdapter'
import { CollectionHierarchy } from '@quatrain/core/lib/backends'

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

export const createEntity = async (forcedValues: any = {}) => {
   //const res = await utils.DataGenerator(Entity, 1, forcedValues)
   const entity = await Entity.factory({ name: 'ACME Inc.' })

   return entity
}

export const createUsers = (
   userModel: User,
   qty: number = 5,
   forcedValues: any = {}
): Promise<User[]> => utils.DataGenerator(userModel, qty, forcedValues)
