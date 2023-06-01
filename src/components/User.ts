import { BaseObject } from './BaseObject'
import { DataObjectClass } from './types/DataObjectClass'
import { UserClass } from './types/UserClass'
import { DateTimeProperty, EnumProperty, ObjectProperty } from '../properties'
import { HashProperty } from '../properties/HashProperty'
import { StringProperty } from '../properties/StringProperty'
import { Entity } from './Entity'
import * as htmlType from '../properties/types/PropertyHTMLType'

/**
 * Callback function to populate the 'name' property
 * @param dao DataObject
 * @returns
 */
const onChange = (dao: DataObjectClass<any>) =>
   dao.set('name', `${dao.val('firstname')} ${dao.val('lastname')}`)


export const UserProperties: any = [
   {
      // change name property minLength
      name: 'name',
      type: StringProperty.TYPE,
      minLength: 0,
      fullSearch: true,
      htmlType: htmlType.NAME,
   },
   {
      name: 'firstname',
      mandatory: true,
      type: StringProperty.TYPE,
      minLength: 1,
      maxLength: 100,
      htmlType: htmlType.GIVEN_NAME,
      onChange,
   },
   {
      name: 'lastname',
      mandatory: true,
      type: StringProperty.TYPE,
      minLength: 1,
      maxLength: 100,
      htmlType: htmlType.FAMILY_NAME,
      onChange,
   },
   {
      name: 'gender',
      mandatory: false,
      type: EnumProperty.TYPE,
      values: ['male', 'female', 'nonbinary'],
      htmlType: htmlType.GENDER,
   },
   {
      name: 'birthday',
      mandatory: false,
      type: DateTimeProperty.TYPE,
      htmlType: htmlType.BIRTHDAY,
   },
   {
      name: 'email',
      mandatory: true,
      type: StringProperty.TYPE,
      minLength: 1,
      maxLength: 100,
      fullSearch: true,
      htmlType: htmlType.EMAIL,
   },
   {
      name: 'password',
      mandatory: true,
      type: HashProperty.TYPE,
      algorithm: HashProperty.ALGORITHM_SHA256,
      salt: '', // you should override it in your code
      minLength: 5,
      maxLength: 20, // this is for the clear password
      htmlType: htmlType.PASSWORD,
   },
   {
      name: 'entity',
      mandatory: false,
      type: ObjectProperty.TYPE,
      instanceof: Entity,
   },
]

export class User extends BaseObject implements UserClass {
   static PROPS_DEFINITION = UserProperties

   static async factory(src: any = undefined): Promise<User> {
      return super.factory(src, User)
   }
}
