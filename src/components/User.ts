import { BaseObject, DataObject, ObjectUri, Property } from '..'
import { DataObjectProperties } from '../properties'

const onChange = (dao:DataObject) => dao.set('name', `${dao.val('firstname')} ${dao.val('lastname')}`)

export const UserProperties: DataObjectProperties = [
   ...BaseObject.PROPS_DEFINITION,
   {
      name: 'firstname',
      mandatory: true,
      type: Property.TYPE_STRING,
      minLength: 1,
      maxLength: 100,
      onChange
   },
   {
      name: 'lastname',
      mandatory: true,
      type: Property.TYPE_STRING,
      minLength: 1,
      maxLength: 100,
      onChange
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

   static async factory(uri: string | ObjectUri | undefined = undefined) {
      const obj = await super.factory(uri)
      obj.get('name').minLength = 0
      return obj
   }
}
