import { BaseObjectCore } from './BaseObjectCore'
import { UserProperties } from '@quatrain/core'

export class User extends BaseObjectCore {
   static PROPS_DEFINITION = UserProperties
   static COLLECTION = 'user'

   static async factory(src: any = undefined): Promise<User> {
      return super.factory(src, User)
   }
}
