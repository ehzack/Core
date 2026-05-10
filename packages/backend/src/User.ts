import { PersistedBaseObject } from './PersistedBaseObject'
import { BaseObjectType, UserProperties } from '@quatrain/core'

export interface UserType extends BaseObjectType {
   name: string
   firstname: string
   lastname: string
   gender?: 'male' | 'female' | 'nonbinary'
   birthday?: Date
   password: string
   email: string
}

/**
 * Core User domain model in the Quatrain framework.
 * Represents an authenticated or registered actor in the system.
 */
export class User extends PersistedBaseObject {
   /** Defines the property schema structure for a User. */
   static PROPS_DEFINITION = UserProperties
   /** The backend database collection name for this model. */
   static COLLECTION = 'user'

   /**
    * Dynamically instantiates a User model from raw data or a backend path.
    * 
    * @param src - Raw data, ObjectUri, or path.
    * @returns A promise resolving to the hydrated User object.
    */
   static async factory(src: any = undefined): Promise<User> {
      return super.factory(src, User)
   }
}
