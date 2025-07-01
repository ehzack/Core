import { User } from '@quatrain/backend'
import { createUser, setup } from './common'

const adapter = setup()
let user: User

beforeAll(async () => {
   user = await createUser()
   await adapter.create(user.dataObject, undefined)
})

afterAll(async () => {
   await adapter.deleteCollection('user')
   await adapter.close()
})

describe('SQLite CRUD operations', () => {
   test('write data', async () => {
      // Check that object is successfully created in backend
      expect(user.dataObject.isPersisted(false)).toBe(true)
      expect(user.uri).not.toBeUndefined()
      expect(user.uid).not.toBeUndefined()
      expect(user.uri.constructor.name).toBe('ObjectUri')
   })

   test('read data', async () => {
      // Retrieve user from empty object and record path
      const user2 = await User.factory()
      user2.dataObject.uri.path = user.dataObject.uri.path

      await adapter.read(user2.dataObject)
      expect(user2._.firstname).toBe(user._.firstname)
      expect(user2._.lastname).toBe(user._.lastname)
      expect(user2._.email).toBe(user._.email)
   })

   test('update data', async () => {
      user._.firstname = 'Jane'
      await adapter.update(user.dataObject)

      // Retrieve user from empty object and record path
      const user2 = await User.factory()
      user2.dataObject.uri.path = user.dataObject.uri.path

      await adapter.read(user2.dataObject)
      expect(user2._.firstname).toBe('Jane')
   })

   test('soft delete data', async () => {
      expect(user.uid).toBeDefined()

      await adapter.delete(user.dataObject, false)
      expect(user.uid).toBeUndefined()
   })

   test('hard delete data', async () => {
      // Create a new user for hard delete test
      const deleteUser = await createUser()
      deleteUser._.email = 'delete@test.com'
      await adapter.create(deleteUser.dataObject, undefined)
      
      expect(deleteUser.uid).toBeDefined()

      await adapter.delete(deleteUser.dataObject, true)
      expect(deleteUser.uid).toBeUndefined()
   })
})