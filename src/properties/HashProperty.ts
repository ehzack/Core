import { StringProperty, StringPropertyType } from './StringProperty'

export type HashPropertyAlgos =
   | typeof HashProperty.ALGORITHM_MD5
   | typeof HashProperty.ALGORITHM_SHA1

export interface HashPropertyType extends StringPropertyType {
   algorithm?: HashPropertyAlgos
   salt?: string
}

export class HashProperty extends StringProperty {
   static ALGORITHM_MD5 = 'md5'
   static ALGORITHM_SHA1 = 'sha1'

   protected _algorithm: HashPropertyAlgos
   protected _salt: string = ''

   constructor(config: HashPropertyType) {
      super(config)
      this._algorithm = config.algorithm || HashProperty.ALGORITHM_MD5
      this._salt = config.salt || ''
   }

   set(value: any) {
      // TODO process hash at one point
      return super.set(value)
   }
}
