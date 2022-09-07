import { Property } from '../properties/Property'
import { DataObject } from './DataObject'
import { DataObjectProperties, HashProperty } from '../properties'
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
      type: Property.TYPE_HASH,
      algorithm: HashProperty.ALGORITHM_SHA256,
      salt: '', // you should override it in your code
      minLength: 1,
      maxLength: 16, // this is for the clear password
   },
]

export class User extends BaseObject {
   static PROPS_DEFINITION = UserProperties
}
