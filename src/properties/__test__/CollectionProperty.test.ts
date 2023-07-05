import { DataObject, Entity, UserCore } from '../../components'
import { DataGenerator } from '../../utils/DataGenerator'
import { MockAdapter } from '../../backends'
import { Core } from '../../Core'
import { EntityCore } from '../../components/Entity'
import { BaseObjectMethods } from '../../components/types/BaseObjectClass'

Core.addBackend(new MockAdapter(), '@mock')
Core.defaultBackend = '@mock'
Core.classRegistry['User'] = UserCore

describe('Collection Property', () => {
   test('can retrieve user records matching relation', async () => {
      const entity: BaseObjectMethods & Entity = await EntityCore.factory()
      await entity.core.save()

      const user = await UserCore.factory()

      // Generate 3 users not associated to any entity
      await DataGenerator(user, 3, { status: 'created' })

      // Generate 3 users associated with entity 1
      await DataGenerator(user, 3, { status: 'created', entity })

      entity.core.val('users').then((value: DataObject[]) => {
         expect(value).toBeInstanceOf(Array)
         expect(value.length).toBe(3)
      })
   })
})
