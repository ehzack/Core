import { User } from '@quatrain/core'
import { createUser, setup } from './common'

const backend = setup()
let user: User

beforeAll(async () => {
   user = (await createUser()) as User
   await user.save()
})

afterAll(async () => {
   await backend.deleteCollection('user')
   //await backend.deleteCollection('entity')
})

describe('Firestore CRUD operations', () => {
   test('write data', async () => {
      // Check that object is successfully created in backend
      expect(user.dataObject.isPersisted()).toBe(true)
      expect(user.uri).not.toBeUndefined()
      expect(user.uid).not.toBeUndefined()
      expect(user.uri.constructor.name).toBe('ObjectUri')
   })

   test('read data', async () => {
      // Retrieve user from empty object and record path
      const user2 = await User.factory()
      user2.dataObject.uri.path = user.dataObject.uri.path

      await backend.read(user2.dataObject)
      expect(user2._.name).toBe(user._.name)
   })

   test('update data', async () => {
      user._.firstname = 'Jane'
      await user.save()

      // Retrieve user from empty object and record path
      const user2 = await User.factory()
      user2.dataObject.uri.path = user.dataObject.uri.path

      await backend.read(user2.dataObject)
      expect(user2._.name).toBe(user._.name)
   })

   test('delete data', async () => {
      expect(user.uid).toBeDefined()

      await backend.delete(user.dataObject)
      expect(user.uid).toBeUndefined()
   })
})
