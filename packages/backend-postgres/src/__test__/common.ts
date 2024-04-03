import { Core, DataObject, Entity, User, utils } from '@quatrain/core'
import { FirestoreAdapter } from '../FirestoreAdapter'

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:4141'

export const setup = () => {
   Core.addBackend(
      new FirestoreAdapter({
         config: {
            projectId: 'quatrain-core-firestore-admin-adapter-test',
            databaseURL: 'http://127.0.0.1:4141',
         },
      }),
      '@default'
   )

   return Core.getBackend()
}

export const createUser = async () => {
   const user = await User.factory()
   user._.firstname = 'John'
   user._.lastname = 'Doe'
   user._.email = 'john@doe.com'
   user._.password = 'azerty'

   return user
}

export const createEntity = async () => {
   const entity = await Entity.factory()
   entity._.name = 'ACME Inc.'

   return entity
}

export const createUsers = (
   userModel: User,
   qty: number = 5,
   forcedValues: any = {}
): Promise<DataObject[]> => utils.DataGenerator(userModel, qty, forcedValues)
