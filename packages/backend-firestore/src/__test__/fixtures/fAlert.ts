import {
   BaseObject,
   BaseObjectCore,
   BaseObjectProperties,
   ObjectUri,
} from '@quatrain/core'

export interface fAlertType extends BaseObject {
   name: string
   user: ObjectUri
}

export const fAlertProperties: any = [
   ...BaseObjectProperties,
   {
      name: 'user',
      type: 'object',
      mandatory: true,
   },
]

/**
 * Mock alert entity for Firestore testing.
 */
export class fAlert extends BaseObjectCore {
   /** Schema properties definition for the test alert. */
   static PROPS_DEFINITION = fAlertProperties
   /** Mock collection name. */
   static COLLECTION = 'alerts'
   /** Defines the parent property for nested collections. */
   static PARENT_PROP = 'user'

   /**
    * Instantiates a mock fAlert.
    * 
    * @param src - Initial mock data.
    * @returns A promise resolving to the fAlert instance.
    */
   static async factory(src: any = undefined): Promise<fAlert> {
      return super.factory(src, fAlert)
   }
}
