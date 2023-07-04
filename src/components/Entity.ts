import { CollectionProperty, StringProperty } from '../properties'
import { BaseObjectCore } from './BaseObject'
import { BaseObject } from './BaseObjectProperties'
import { User, UserCore } from './User'
import { EntityClass } from './types/EntityClass'

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
