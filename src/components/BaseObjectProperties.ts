import * as statuses from '../statuses'
import { ObjectUri } from './ObjectUri'
import { StringProperty } from '../properties/StringProperty'
import { ObjectProperty } from '../properties/ObjectProperty'
import { EnumProperty } from '../properties/EnumProperty'
import { DateTimeProperty } from '../properties/DateTimeProperty'
import * as htmlType from '../properties/types/PropertyHTMLType'
import { User } from './User'
import { BaseObjectCore } from './BaseObject'

export interface BaseObject {
   name: string
   status: string
   createdBy?: User | ObjectUri
   createdAt?: number
   updatedBy?: User | ObjectUri
   updatedAt?: number
   deletedBy?: User | ObjectUri
   deletedAt?: number
   readonly toJSON: () => object
   readonly core: BaseObjectCore
}

export const BaseObjectProperties: any = [
   {
      name: 'name',
      mandatory: true,
      type: StringProperty.TYPE,
      minLength: 1,
      maxLength: 100,
      htmlType: htmlType.NAME,
   },
   {
      name: 'status',
      mandatory: true,
      type: EnumProperty.TYPE,
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
      type: ObjectProperty.TYPE,
      instanceOf: 'User',
      mandatory: true,
      protected: true,
   },
   {
      name: 'createdAt',
      type: DateTimeProperty.TYPE,
      mandatory: true,
      protected: true,
   },
   {
      name: 'updatedBy',
      type: ObjectProperty.TYPE,
      instanceOf: 'User',
   },
   {
      name: 'updatedAt',
      type: DateTimeProperty.TYPE,
   },
   {
      name: 'deletedBy',
      type: ObjectProperty.TYPE,
      instanceOf: 'User',
      protected: true,
   },
   {
      name: 'deletedAt',
      type: DateTimeProperty.TYPE,
      protected: true,
   },
]
