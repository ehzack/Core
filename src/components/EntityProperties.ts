import { CollectionProperty } from '../properties'
import { StringProperty } from '../properties/StringProperty'
import * as htmlType from '../properties/types/PropertyHTMLType'
import { User } from './User'

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
      instanceOf: User,
      parentKey: 'entity',
   },
]
