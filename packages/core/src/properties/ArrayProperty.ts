import { BaseProperty, BasePropertyType } from './BaseProperty'
import { StringProperty } from './StringProperty'

/**
 * Configuration dictionary for instantiating an `ArrayProperty`.
 * Restricts the length and content types of an array.
 *
 * | Parameter | Type | Description | Default |
 * | :--- | :--- | :--- | :--- |
 * | `minLength` | number | Minimum number of elements required in the array. | `0` |
 * | `maxLength` | number | Maximum number of elements allowed in the array. | `0` (unlimited) |
 * | `allowNumbers` | boolean | If false, throws an error if the array contains numeric elements. | `true` |
 * | `allowStrings` | boolean | If false, throws an error if the array contains string elements. | `true` |
 */
export interface ArrayPropertyType extends BasePropertyType {
   minLength?: number
   maxLength?: number
   allowNumbers?: boolean
   allowStrings?: boolean
}

/**
 * A property type that validates and manages arrays of primitive values.
 * Allows enforcement of minimum and maximum element counts, as well as primitive type restrictions.
 * 
 * @example
 * ```typescript
 * const tags = new ArrayProperty({
 *    name: 'tags',
 *    minLength: 1,
 *    maxLength: 5,
 *    allowNumbers: false // Only string tags allowed
 * });
 * 
 * tags.set(['typescript', 'quatrain']); // OK
 * tags.set([123]); // Throws Error: Numbers are not allowed in value
 * ```
 */
export class ArrayProperty extends BaseProperty {
   /** The string literal type identifier for this property. */
   static TYPE = 'array'
   protected _value: Array<any> | undefined = undefined

   protected _minLength: number = 0
   protected _maxLength: number = 0

   constructor(config: ArrayPropertyType) {
      super(config)
      this.minLength = config.minLength || 0
      this.maxLength = config.maxLength || 0
      if (this._enable(config.allowNumbers)) {
         this._allows.push(StringProperty.ALLOW_NUMBERS)
      }
      if (this._enable(config.allowStrings)) {
         this._allows.push(StringProperty.ALLOW_STRINGS)
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

   /**
    * Assigns a new array value while enforcing length constraints and content type rules.
    * 
    * @param value - The array to assign. Null values are cast to empty arrays `[]`.
    * @param setChanged - Whether to mark the property as modified.
    * @returns The property instance for chaining.
    * @throws {Error} If the value is not an array, violates length bounds, or contains forbidden types.
    */
   set(value: Array<any>, setChanged = true) {
      if (value === null) {
         value = []
      }
      if (!Array.isArray(value)) {
         throw new Error(`value ${JSON.stringify(value)} is not an array`)
      }

      if (this._minLength > 0 && value.length < this._minLength) {
         throw new Error(`Array has too few values`)
      }

      if (this._maxLength > 0 && value.length > this._maxLength) {
         throw new Error(`Array values are too many`)
      }

      const joined = value.join()

      if (
         this._allows.includes(StringProperty.ALLOW_STRINGS) === false &&
         /[a-zA-Z]/.test(joined)
      ) {
         throw new Error(`Strings are not allowed in value`)
      }

      if (
         this._allows.includes(StringProperty.ALLOW_NUMBERS) === false &&
         /\d/.test(joined)
      ) {
         throw new Error(`Numbers are not allowed in value`)
      }

      return super.set(value, setChanged)
   }

   /**
    * Retrieves the array, optionally applying a mapping/transformation function.
    * 
    * @param transform - A custom function to apply to the array before returning it.
    * @returns The raw or transformed array.
    */
   get(transform: Function | undefined = undefined) {
      return transform ? transform(this._value) : this._value
   }

   /**
    * Serializes the array for JSON stringification.
    * 
    * @returns The raw internal array.
    */
   toJSON() {
      return this._value
   }
}
