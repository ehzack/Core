import { BaseObjectCore } from './BaseObject'
import { BaseObject } from './BaseObjectProperties'
import { User, UserCore } from './User'
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

export interface Entity extends BaseObject {
   users: User
}
export class EntityCore extends BaseObjectCore implements EntityClass {
   static COLLECTION = 'entity'

   static PROPS_DEFINITION = [
      {
         // surcharge property minLength and htmlType
         name: 'name',
         type: StringProperty.TYPE,
         mandatory: true,
         minLength: 1,
         //htmlType: htmlType.ORG,
      },
      {
         name: 'users',
         mandatory: true,
         type: CollectionProperty.TYPE,
         instanceOf: UserCore,
         parentKey: 'entity',
      },
   ]
}
