import { DataObject, ObjectUri, User } from '../../components'
import { Query } from '../../backends'
import { UserDataGenerator } from './fixtures/Generators'
import { returnAs } from '../Query'

const MEMBERS = 5

// Generate data of fake users on mock adapter
const uids = UserDataGenerator(MEMBERS)

describe('Test Query object', () => {
   test('A simple query', () => {
      const query = new Query(User)
      query.execute().then((value: DataObject[]) => {
         //const user = MockAdapter.getFixture(value[0].path)
         expect(value).toBeInstanceOf(Array)
         expect(value.length).toBe(MEMBERS)
         expect(value[0]).toBeInstanceOf(DataObject)
         expect(value[0].uid).toBe(uids[0])
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
         expect(value[0].uid).toBe(uids[0])
         expect(value[0].collection).toBe(`users`)
      })
   })

   test('return object instances', () => {
      const query = new Query(User)
      query.execute(returnAs.AS_INSTANCES).then((value) => {
         expect(value).toBeInstanceOf(Array)
         expect(value.length).toBe(MEMBERS)
         expect(value[0]).toBeInstanceOf(User)
         expect(value[0].uid).toBe(uids[0])
      })
   })
})
