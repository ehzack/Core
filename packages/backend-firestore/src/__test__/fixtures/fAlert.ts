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

export class fAlert extends BaseObjectCore {
   static PROPS_DEFINITION = fAlertProperties
   static COLLECTION = 'alerts'
   static PARENT_PROP = 'user'

   static async factory(src: any = undefined): Promise<fAlert> {
      return super.factory(src, fAlert)
   }
}
