import * as statuses from '../../../statuses'
import { BooleanProperty } from '../../../properties/BooleanProperty'
import { EnumProperty } from '../../../properties/EnumProperty'
import { ObjectProperty } from '../../../properties/ObjectProperty'
import { StringProperty } from '../../../properties/StringProperty'
import { DataObjectProperties } from '../../../properties'
import { BaseObject } from '../../BaseObject'
import { ObjectUri } from '../../ObjectUri'

export const fClassProperties: DataObjectProperties = [
   {
      name: 'a',
      type: StringProperty.TYPE,
   },
]
export class fClass extends BaseObject {
   static PROPS_DEFINITION: DataObjectProperties = [
      {
         name: 'a',
         type: StringProperty.TYPE,
      },
   ]
}

export const properties: DataObjectProperties = [
   {
      name: 'string',
      mandatory: true,
      type: StringProperty.TYPE,
      defaultValue: 'nothing',
   },
   {
      name: 'boolean',
      type: BooleanProperty.TYPE,
      defaultValue: false,
   },
   {
      name: 'enum',
      type: EnumProperty.TYPE,
      values: ['Mr', 'Miss', 'Ms', 'Dr'],
   },
   {
      name: 'object',
      type: ObjectProperty.TYPE,
      instanceOf: fClass.prototype,
   },
]

export const fData = {
   uid: 'a/b',
   path: 'a/b',
   string: 'a string',
   boolean: true,
   enum: 'Miss',
   object: new ObjectUri('c/d'),
}

export const baseObjectUri = 'baseobject/xyz'
export const UserUri = 'users/abc'

export const BaseObjectData = {
   uid: baseObjectUri,
   path: baseObjectUri,
   name: 'a simple object',
   status: statuses.PENDING,
}

export const UserData = {
   uid: 'abc',
   path: UserUri,
   name: 'John Doe',
   status: statuses.ACTIVE,
   firstname: 'John',
   lastname: 'Doe',
   email: 'john@doe.com',
   password: 'f2d81a260dea8a100dd517984e53c56a7523d96942a834b9cdc249bd4e8c7aa9',
   createdBy: { label: 'John Doe', ref: UserUri, backend: '@mock' },
   createdAt: 1,
}
