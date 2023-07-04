import { DataObject, Entity, UserCore } from '../../components'
import { DataGenerator } from '../../utils/DataGenerator'
import { MockAdapter } from '../../backends'
import { Core } from '../../Core'
import { EntityCore } from '../../components/Entity'

Core.addBackend(new MockAdapter(), '@mock')
Core.defaultBackend = '@mock'

describe('Collection Property', () => {
   let entity: Entity

   beforeAll(async () => {
      entity = await EntityCore.factory()
      await entity.core.save()

      const user = await UserCore.factory()

      // Generate 3 users not associated to any entity
      await DataGenerator(user, 3, { status: 'created' })

      // Generate 3 users associated with entity 1
      await DataGenerator(user, 3, { status: 'created', entity })
   })

   test('can retrieve user records matching relation', () => {
      entity.core.val('users').then((value: DataObject[]) => {
         expect(value).toBeInstanceOf(Array)
         expect(value.length).toBe(3)
      })
   })
})
