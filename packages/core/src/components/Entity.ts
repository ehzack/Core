import { BaseObject } from './BaseObject'
import { BaseObjectProperties } from './BaseObjectProperties'
//import { User } from './User'
//import { CollectionProperty } from '../properties/CollectionProperty'
import { StringProperty } from '../properties/StringProperty'
import * as htmlType from '../properties/types/PropertyHTMLType'
import { BaseObjectType } from './types/BaseObjectType'

export interface EntityType extends BaseObjectType {
   //   users?: User[]
}

export class Entity extends BaseObject {
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
