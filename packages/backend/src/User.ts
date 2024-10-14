import { BaseObjectCore } from './BaseObjectCore'
import { BaseObject, UserProperties } from '@quatrain/core'

export interface UserType extends BaseObject {
   name: string
   firstname: string
   lastname: string
   gender?: 'male' | 'female' | 'nonbinary'
   birthday?: Date
   password: string
   email: string
}

export class User extends BaseObjectCore {
   static PROPS_DEFINITION = UserProperties
   static COLLECTION = 'user'

   static async factory(src: any = undefined): Promise<User> {
      return super.factory(src, User)
   }
}
