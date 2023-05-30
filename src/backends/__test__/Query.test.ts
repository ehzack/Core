import { DataObject, ObjectUri, User } from '../../components'
import { MockAdapter, Query } from '../../backends'
import { DataGenerator } from '../../utils'
import { returnAs } from '../Query'
import { Core } from '../../Core'

Core.addBackend(new MockAdapter(), '@mock')
Core.defaultBackend = '@mock'

const MEMBERS = 5

describe('Test Query object', () => {
   let uids: DataObject[]

   beforeAll(async () => {
      // Generate data of fake users on mock adapter
      uids = await DataGenerator<User>(await User.factory(), MEMBERS)
   })


   test('A simple query', () => {
      const query = new Query(User)
      query.execute().then((value: DataObject[]) => {
         //const user = MockAdapter.getFixture(value[0].path)
         expect(value).toBeInstanceOf(Array)
         expect(value.length).toBe(MEMBERS)
         expect(value[0]).toBeInstanceOf(DataObject)
         expect(value[0].uid).toBe(uids[0].uid)
         //expect(value[0].val('email')).toBe(user['email'])
         //expect(value[0].class).toBe(User)
      })
   })

   test('return object uris', () => {
      const query = new Query(User)
      query.execute(returnAs.AS_OBJECTURIS).then((value) => {
         expect(value).toBeInstanceOf(Array)
         expect(value.length).toBe(MEMBERS)
         expect(value[0]).toBeInstanceOf(ObjectUri)
         expect(value[0].uid).toBe(uids[0].uid)
         expect(value[0].collection).toBe(`user`)
      })
   })

   test('return object instances', () => {
      const query = new Query(User)
      query.execute(returnAs.AS_INSTANCES).then((value) => {
         expect(value).toBeInstanceOf(Array)
         expect(value.length).toBe(MEMBERS)
         expect(value[0]).toBeInstanceOf(User)
         expect(value[0].uid).toBe(uids[0].uid)
      })
   })
})
