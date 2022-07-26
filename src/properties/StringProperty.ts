import { BaseProperty, BasePropertyType } from './BaseProperty'
import { Property, PropertyType } from './Property'

export interface StringPropertyType extends BasePropertyType {
   minLength?: number
   maxLength?: number
   allowSpaces?: boolean
   allowDigits?: boolean
   allowLetters?: boolean
   allowPattern?: String
}

export class StringProperty extends BaseProperty {
   static TRANSFORM_UCASE = 'upper'
   static TRANSFORM_LCASE = 'lower'

   protected _minLength: number = 0
   protected _maxLength: number = 0

   protected _value: string | undefined

   constructor(config: StringPropertyType) {
      super(config)
      this._minLength = config.minLength || 0
      this._maxLength = config.maxLength || 0
      if (this._enable(config.allowSpaces)) {
         this._allows.push(Property.ALLOW_SPACES)
      }
      if (this._enable(config.allowDigits)) {
         this._allows.push(Property.ALLOW_DIGITS)
      }
      if (this._enable(config.allowLetters)) {
         this._allows.push(Property.ALLOW_LETTERS)
      }
   }

   set(value: any) {
      if (
         this._allows.includes(Property.ALLOW_DIGITS) === false &&
         /\d/.test(value)
      ) {
         throw new Error(`Digits are not allowed in value`)
      }

      if (
         this._allows.includes(Property.ALLOW_SPACES) === false &&
         /\s/g.test(value)
      ) {
         throw new Error(`Spaces are not allowed in value`)
      }

      if (
         this._allows.includes(Property.ALLOW_LETTERS) === false &&
         /[a-zA-Z]/.test(value)
      ) {
         throw new Error(`Letters are not allowed in value`)
      }

      if (this._minLength > 0 && value.length < this._minLength) {
         throw new Error(`Value is too short`)
      }

      if (this._maxLength > 0 && value.length > this._maxLength) {
         throw new Error(`Value is too long`)
      }

      return super.set(value)
   }

   get(transform: string | undefined = undefined) {
      switch (transform) {
         case StringProperty.TRANSFORM_LCASE:
            return this._value && this._value.toLowerCase()
         case StringProperty.TRANSFORM_UCASE:
            return this._value && this._value.toUpperCase()
         default:
            return this._value
      }
   }

   get minLength() {
      return this._minLength
   }

   get maxLength() {
      return this._maxLength
   }
}
