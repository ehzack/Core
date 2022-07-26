import { BaseObject } from '..'
import { statuses } from '../..'
import { MockAdapter } from '../../backends'
import { BaseObjectData, baseObjectUri } from './fixtures/dao'

MockAdapter.inject(BaseObjectData) // set default to @mock

describe('Base object', () => {
   test('has name and status properties that are instances', () =>
      BaseObject.factory().then(obj => {
         expect(obj.get('name').constructor.name).toBe('StringProperty')
         expect(obj.get('status').constructor.name).toBe('EnumProperty')
      }))

   test('can be persisted in backend', () => {
      BaseObject.factory()
         .then(obj => {
            expect(obj.uid).toBeUndefined()
            obj.set('name', 'a name')
            obj.save().then(() => {
               expect(obj.uid).not.toBeUndefined()
               expect(obj.val('name')).toEqual('a name')
               expect(obj.val('status')).toEqual(statuses.CREATED)
            })
         })
         .catch(e => console.log(e))
   })

   test('can be populated with data', () => {
      BaseObject.factory(baseObjectUri)
         .then(obj => {
            expect(obj.val('name')).toEqual('a simple object')
            expect(obj.val('status')).toEqual(statuses.PENDING)
         })
         .catch(e => console.log(e))
   })
})
