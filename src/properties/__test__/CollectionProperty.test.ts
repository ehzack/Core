import { DataObject, User } from '../../components'
import { CollectionProperty } from '../CollectionProperty'
import { UserDataGenerator } from '../../backends/__test__/fixtures/Generators'
import { MockAdapter } from '../../backends'

// inject Entity
MockAdapter.inject({
   uid: 'first',
   path: 'entities/first',
   name: 'Acme Inc.',
})

const factory = () =>
   DataObject.factory({
      properties: [
         {
            name: 'collection',
            mandatory: true,
            type: CollectionProperty.TYPE,
            instanceOf: User,
            parentKey: 'entity',
         },
      ],
      uri: 'entities/abc',
   })

describe('Collection Property', () => {
   test('can retrieve user records matching relation', () => {
      // Generate 3 users not associated to any entity
      UserDataGenerator(3)
      // Generate 3 users associated with entity 1
      UserDataGenerator(3, `entities/abc`)
      factory().then((dao) =>
         dao.val('collection').then((value: DataObject[]) => {
            expect(value).toBeInstanceOf(Array)
            expect(value.length).toBe(3)
         })
      )
   })
})
