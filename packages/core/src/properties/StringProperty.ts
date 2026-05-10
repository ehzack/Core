//import { Property } from './Property'
import { BaseProperty, BasePropertyType } from './BaseProperty'

/**
 * Configuration dictionary for instantiating a `StringProperty`.
 * Defines length constraints and character-level validation.
 *
 * | Parameter | Type | Description | Default |
 * | :--- | :--- | :--- | :--- |
 * | `minLength` | number | Minimum length of the string. | `0` |
 * | `maxLength` | number | Maximum length of the string. | `0` (unlimited) |
 * | `allowSpaces` | boolean | If false, throws an error if the string contains whitespace. | `true` |
 * | `allowDigits` | boolean | If false, throws an error if the string contains digits (0-9). | `true` |
 * | `allowLetters` | boolean | If false, throws an error if the string contains letters (a-z, A-Z). | `true` |
 * | `allowPattern` | string | A regular expression pattern the string must match. | `undefined` |
 * | `fullSearch` | boolean | Indicates to the backend if this field should be indexed for full-text search. | `false` |
 */
export interface StringPropertyType extends BasePropertyType {
   minLength?: number
   maxLength?: number
   allowSpaces?: boolean
   allowDigits?: boolean
   allowLetters?: boolean
   allowPattern?: string
   fullSearch?: boolean
}

/**
 * A property type strictly validating and handling strings.
 * It ensures that length constraints and specific character rules are respected before saving.
 * 
 * @example
 * ```typescript
 * const username = new StringProperty({
 *    name: 'username',
 *    minLength: 3,
 *    maxLength: 15,
 *    allowSpaces: false
 * });
 * 
 * username.set('my user'); // Throws Error: Spaces are not allowed
 * username.set('my_user'); // OK
 * console.log(username.get(StringProperty.TRANSFORM_UCASE)); // "MY_USER"
 * ```
 */
export class StringProperty extends BaseProperty {
   /** The string literal type identifier for this property. */
   static TYPE = 'string'

   /** Transformation identifier to convert string to uppercase. */
   static TRANSFORM_UCASE = 'upper'
   /** Transformation identifier to convert string to lowercase. */
   static TRANSFORM_LCASE = 'lower'

   /** Permission flag to allow whitespace characters. */
   static ALLOW_SPACES = 'spaces'
   /** Permission flag to allow alphabetic letters. */
   static ALLOW_LETTERS = 'letters'
   /** Permission flag to allow numeric digits. */
   static ALLOW_DIGITS = 'digits'
   /** Permission flag to allow string values. */
   static ALLOW_STRINGS = 'strings'
   /** Permission flag to allow number values. */
   static ALLOW_NUMBERS = 'numbers'

   protected _minLength: number = 0
   protected _maxLength: number = 0
   protected _fullSearch: boolean = false

   protected declare _value: string | undefined

   /**
    * Set to false to bypass some rules
    */
   protected _rawValue = true

   constructor(config: StringPropertyType) {
      super(config)
      this.minLength = config.minLength || 0
      this.maxLength = config.maxLength || 0
      this.fullSearch = config.fullSearch || false
      if (this._enable(config.allowSpaces)) {
         this._allows.push(StringProperty.ALLOW_SPACES)
      }
      if (this._enable(config.allowDigits)) {
         this._allows.push(StringProperty.ALLOW_DIGITS)
      }
      if (this._enable(config.allowLetters)) {
         this._allows.push(StringProperty.ALLOW_LETTERS)
      }
   }

   /**
    * Assigns a new string value while strictly enforcing length and character constraints.
    * 
    * @param value - The string to assign.
    * @param setChanged - Whether to mark the property as modified.
    * @returns The property instance for chaining.
    * @throws {Error} If the string contains forbidden characters (spaces, letters, digits) or violates length limits.
    */
   set(value: any, setChanged = true) {
      if (this._rawValue && value !== null && value !== undefined) {
         if (
            !this._allows.includes(StringProperty.ALLOW_DIGITS) &&
            /\d/.test(value)
         ) {
            throw new Error(`Digits are not allowed in value`)
         }

         if (
            !this._allows.includes(StringProperty.ALLOW_SPACES) &&
            /\s/.test(value)
         ) {
            throw new Error(`Spaces are not allowed in value`)
         }

         if (
            !this._allows.includes(StringProperty.ALLOW_LETTERS) &&
            /[a-zA-Z]/.test(value)
         ) {
            throw new Error(`Letters are not allowed in value`)
         }

         if (this._minLength > 0 && value.length < this._minLength) {
            throw new Error(`${this._name}: value '${value}' is too short (min ${this._minLength})`)
         }

         if (this._maxLength > 0 && value.length > this._maxLength) {
            throw new Error(`${this._name}: value '${value}' is too long`)
         }
      }
      return super.set(value, setChanged)
   }

   /**
    * Retrieves the string value, optionally applying a casing transformation.
    * 
    * @param transform - Use `TRANSFORM_LCASE` or `TRANSFORM_UCASE` to mutate output case.
    * @returns The raw or transformed string, or undefined.
    */
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

   set fullSearch(mode: boolean) {
      this._fullSearch = mode
   }

   get fullSearch() {
      return this._fullSearch
   }
}
