import * as statuses from '../../../statuses'
import { DataObjectProperties } from '../../../properties'
import { Property } from '../../../properties/Property'

export class fClass {}

export const properties: DataObjectProperties = [
   {
      name: 'string',
      mandatory: true,
      type: Property.TYPE_STRING,
      defaultValue: 'nothing',
   },
   {
      name: 'boolean',
      type: Property.TYPE_BOOLEAN,
      defaultValue: false,
   },
   {
      name: 'enum',
      type: Property.TYPE_ENUM,
      values: ['Mr', 'Miss', 'Ms', 'Dr'],
   },
   {
      name: 'object',
      type: Property.TYPE_OBJECT,
      instanceOf: fClass,
   },
]

export const fData = {
   uid: 'a/b',
   string: 'a string',
   boolean: true,
   enum: 'Miss',
   object: new fClass(),
}

export const baseObjectUri = 'baseobject/xyz'

export const BaseObjectData = {
   uid: baseObjectUri,
   name: 'a simple object',
   status: statuses.PENDING,
}

export const UserUri = 'users/abc'

export const UserData = {
   uid: UserUri,
   name: ' ',
   status: statuses.ACTIVE,
   firstname: 'John',
   lastname: 'Doe',
   email: 'john@doe.com',
   password: 'azerty',
}
