import { DataObject } from '../../components'
import { fClass } from '../../components/__test__/fixtures/dao'
import { Core } from '../../Core'
import { Property } from '../../properties'
import { MockAdapter } from '../MockAdapter'

// inject() makes @mock default backend

const backend = Core.getBackend('@mock')

describe('CRUD operations', () => {
   test('write data', async () => {
      // create a basic data object
      const dao = await DataObject.factory(fClass.prototype, [
         { name: 'a', type: Property.TYPE_STRING },
      ])

      // set an acceptable value to its property
      dao.set('a', 'a string')

      // Check that object is successfully created in backend
      backend.create(dao).then(() => {
         expect(dao.isPersisted()).toBe(true)
         expect(dao.uri).not.toBeUndefined()
         expect(dao.uid).not.toBeUndefined()
         expect(dao.uri?.constructor.name).toBe('ObjectUri')
         expect(dao.uid && MockAdapter.getFixture(dao.uid)).not.toBeUndefined()
         expect(dao.uid && MockAdapter.getFixture(dao.uid)).toContain('a')
      })
   })

   test.only('read data', async () => {
      MockAdapter.inject({ uid: 'a/b', a: 'b', c: 'd', e: 3 })

      const dao = await DataObject.factory(fClass.prototype)
      dao.uri = 'a/b'

      console.log(dao)

      backend.read(dao).then(() => {
         expect(dao.val('a')).toBe('b')
      })
   })

   test('update data', async () => {
      const dao = await DataObject.factory(fClass.prototype)

      dao.uri = 'a/b'

      //dao.set('a', 'a string')

      backend.read(dao).then(() => {
         dao.set('a', 'another string')
         backend.update(dao).then(() => {
            const fixture = dao.uid && MockAdapter.getFixture(dao.uid)
            expect(fixture.a).toEqual('another string')
         })
      })
   })

   test('delete data', async () => {
      const dao = await DataObject.factory(fClass.prototype, [
         { name: 'a', type: Property.TYPE_STRING },
      ])

      dao.uri = 'a/b'

      backend.delete(dao).then(() => {
         expect(dao.uid).toBeUndefined()
      })
   })
})
