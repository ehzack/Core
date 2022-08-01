import { Property } from '../properties/Property'
import { DataObject } from './DataObject'
import { DataObjectProperties } from '../properties'
import { BaseObject } from './BaseObject'

const onChange = (dao: DataObject) =>
   dao.set('name', `${dao.val('firstname')} ${dao.val('lastname')}`)

export const UserProperties: DataObjectProperties = [
   {
      // change name property minLength
      name: 'name',
      type: Property.TYPE_STRING,
      minLength: 0,
   },
   {
      name: 'firstname',
      mandatory: true,
      type: Property.TYPE_STRING,
      minLength: 1,
      maxLength: 100,
      onChange,
   },
   {
      name: 'lastname',
      mandatory: true,
      type: Property.TYPE_STRING,
      minLength: 1,
      maxLength: 100,
      onChange,
   },
   {
      name: 'email',
      mandatory: true,
      type: Property.TYPE_STRING,
      minLength: 1,
      maxLength: 100,
   },
   {
      name: 'password',
      mandatory: true,
      type: Property.TYPE_STRING,
      minLength: 1,
      maxLength: 24,
   },
]

export class User extends BaseObject {
   static PROPS_DEFINITION = UserProperties
}
