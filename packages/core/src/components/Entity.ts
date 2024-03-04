import { BaseObjectCore } from './BaseObjectCore'
import { BaseObject, BaseObjectProperties } from './BaseObject'
//import { User } from './User'
//import { CollectionProperty } from '../properties/CollectionProperty'
import { StringProperty } from '../properties/StringProperty'
import * as htmlType from '../properties/types/PropertyHTMLType'

export interface EntityType extends BaseObject {
   //   users?: User[]
}

export class Entity extends BaseObjectCore {
   static COLLECTION = 'entities'

   static PROPS_DEFINITION = [
      ...BaseObjectProperties,
      {
         // surcharge property minLength and htmlType
         name: 'name',
         type: StringProperty.TYPE,
         mandatory: true,
         minLength: 1,
         htmlType: htmlType.ORG,
      },
      // {
      //    name: 'users',
      //    mandatory: true,
      //    type: CollectionProperty.TYPE,
      //    instanceOf: User,
      //    parentKey: 'entity',
      // },
   ]

   static async factory(src: any = undefined): Promise<Entity> {
      return super.factory(src, Entity)
   }
}
