import { BaseObject } from '../BaseObject'
import { statuses } from '../..'
import { MockAdapter } from '../../backends'
import {
   BaseObjectData,
   baseObjectUri,
   UserData,
   UserUri,
} from './fixtures/dao'
import { User } from '../User'

MockAdapter.inject(BaseObjectData) // sets default to @mock
MockAdapter.inject(UserData)

describe('Base object', () => {
   test('has name, status and createdBy properties that are instances', () =>
      BaseObject.factory().then((obj) => {
         expect(obj.get('name').constructor.name).toBe('StringProperty')
         expect(obj.get('status').constructor.name).toBe('EnumProperty')
         expect(obj.get('createdBy').constructor.name).toBe('ObjectProperty')
      }))

   test('can be persisted in backend', () => {
      BaseObject.factory()
         .then((obj) => {
            User.factory(UserUri).then((user: User) => {
               expect(obj.uid).toBeUndefined()
               obj.set('name', 'a name')
               obj.set('createdBy', user)
               obj.save().then(() => {
                  expect(obj.uid).not.toBeUndefined()
                  expect(obj.val('name')).toEqual('a name')
                  expect(obj.val('status')).toEqual(statuses.CREATED)
                  expect(obj.val('createdBy')).toBe(user)
               })
            })
         })
         .catch((e) => console.log(e))
   })

   test('can be populated with data', () => {
      BaseObject.factory(baseObjectUri)
         .then((obj) => {
            User.factory(UserUri)
               .then((user: User) => {
                  obj.set('createdBy', user)
                  expect(obj.val('name')).toEqual('a simple object')
                  expect(obj.val('status')).toEqual(statuses.PENDING)
                  expect(obj.val('createdBy')).toEqual(user)
               })
               .catch((e) => console.log(e))
         })
         .catch((e) => console.log(e))
   })
})
