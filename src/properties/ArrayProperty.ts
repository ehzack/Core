import { Property } from './Property'
import { BaseProperty, BasePropertyType } from './BaseProperty'

export interface ArrayPropertyType extends BasePropertyType {
   minLength?: number
   maxLength?: number
   allowNumbers?: boolean
   allowStrings?: boolean
}

export class ArrayProperty extends BaseProperty {
   protected _value: Array<any> | undefined = undefined

   protected _minLength: number = 0
   protected _maxLength: number = 0

   constructor(config: ArrayPropertyType) {
      super(config)
      this.minLength = config.minLength || 0
      this.maxLength = config.maxLength || 0
      if (this._enable(config.allowNumbers)) {
         this._allows.push(Property.ALLOW_NUMBERS)
      }
      if (this._enable(config.allowStrings)) {
         this._allows.push(Property.ALLOW_STRINGS)
      }
   }

   set minLength(min: number) {
      this._minLength = min >= 0 ? min : 0
   }

   get minLength() {
      return this._minLength
   }

   set maxLength(max: number) {
      this._maxLength = max >= 0 ? max : 0
   }
   get maxLength() {
      return this._maxLength
   }

   set(value: Array<any>) {
      if (!Array.isArray(value)) {
         throw new Error(`value ${JSON.stringify(value)} is not an array`)
      }

      // TODO add controls over allowed values

      return super.set(value)
   }

   toJSON() {
      return this._value
   }
}
