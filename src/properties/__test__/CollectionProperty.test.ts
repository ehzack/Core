import { DataObject, Entity, User } from '../../components'
import { DataGenerator } from '../../utils'
import { MockAdapter } from '../../backends'
import { Core } from '../../Core'

Core.addBackend(new MockAdapter(), '@mock')
Core.defaultBackend = '@mock'

describe('Collection Property', () => {
   let entity: Entity

   beforeAll(async () => {
      entity = await Entity.factory()
      await entity.save()

      const user = await User.factory()

      // Generate 3 users not associated to any entity
      await DataGenerator(user, 3, { status: 'created' })

      // Generate 3 users associated with entity 1
      await DataGenerator(user, 3, { status: 'created', entity })
   })

   test('can retrieve user records matching relation', () => {
      entity.val('users').then((value: DataObject[]) => {
         expect(value).toBeInstanceOf(Array)
         expect(value.length).toBe(3)
      })
   })
})
