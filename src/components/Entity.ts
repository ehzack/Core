import { BaseObject } from './BaseObject'
import { EntityClass } from './types/EntityClass'
import { CollectionProperty } from '../properties/CollectionProperty'
import { StringProperty } from '../properties/StringProperty'
import * as htmlType from '../properties/types/PropertyHTMLType'

export const EntityProperties: any = [
   {
      // surcharge property minLength and htmlType
      name: 'name',
      type: StringProperty.TYPE,
      mandatory: true,
      minLength: 1,
      htmlType: htmlType.ORG,
   },
   {
      name: 'users',
      mandatory: true,
      type: CollectionProperty.TYPE,
      instanceOf: 'User',
      parentKey: 'entity',
   },
]

export class Entity extends BaseObject implements EntityClass {
   static PROPS_DEFINITION = EntityProperties

   static async factory(src: any = undefined): Promise<Entity> {
      return super.factory(src, Entity)
   }
}
