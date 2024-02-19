import { BaseObjectCore } from '../BaseObjectCore'
import { Core, statuses } from '../..'
import { MockAdapter } from '../../backends'
import { BaseObjectData, UserData, UserUri } from './fixtures/dao'
import { User, UserCore } from '../User'
import { Persisted } from '../types/Persisted'

Core.addBackend(new MockAdapter(), '@mock', true)

MockAdapter.inject(BaseObjectData)
MockAdapter.inject(UserData)

describe('Base object', () => {
   test('has name, status and createdBy properties that are instances', () =>
      BaseObjectCore.factory().then((obj) => {
         expect(obj.core.get('name').constructor.name).toBe('StringProperty')
         expect(obj.core.get('status').constructor.name).toBe('EnumProperty')
         expect(obj.core.get('createdBy').constructor.name).toBe(
            'ObjectProperty'
         )
         expect(obj.core.get('createdAt').constructor.name).toBe(
            'DateTimeProperty'
         )
      }))
})

describe('User object', () => {
   test('can be loaded from backend', () => {
      UserCore.factory(UserUri).then((user: User) => {
         expect(user.name).toEqual('John Doe')
         expect(user.status).toEqual(statuses.ACTIVE)
         //expect(user.createdBy).toEqual(user.toJSON())
         expect(user.createdAt).toEqual(1)
      })
   })

   test('can be persisted in backend', () => {
      UserCore.factory(UserUri)
         .then((existingUser: User) => {
            Core.currentUser = existingUser
            UserCore.factory()
               .then((user) => {
                  expect((user as Persisted<User>).uid).toBeUndefined()
                  user.name = 'Jane Doe'
                  user.core.save().then(() => {
                     expect('uid' in user).toBeTruthy()
                     expect(user.name).toEqual('Jane Doe')
                     expect(user.status).toEqual(statuses.CREATED)
                  })
               })
               .catch((e) => console.log(e))
         })
         .catch((e) => console.log(e))
         .catch((e) => console.log(e))
   })
})
