import { Property } from '../properties/Property'
import { DataObjectProperties } from '../properties'
import * as statuses from '../statuses'
//import { User } from './User'

export const BaseObjectProperties: DataObjectProperties = [
   {
      name: 'name',
      mandatory: true,
      type: Property.TYPE_STRING,
      minLength: 1,
      maxLength: 100,
   },
   {
      name: 'status',
      mandatory: true,
      type: Property.TYPE_ENUM,
      values: [
         statuses.CREATED,
         statuses.PENDING,
         statuses.ACTIVE,
         statuses.DELETED,
      ],
      defaultValue: statuses.CREATED,
   },
   {
      name: 'createdBy',
      type: Property.TYPE_OBJECT,
      instanceOf: 'User',
      mandatory: true,
   },
]
