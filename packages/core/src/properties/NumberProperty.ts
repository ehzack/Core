import { BaseProperty, BasePropertyType } from './BaseProperty'

export type NumberSign =
   | typeof NumberProperty.TYPE_SIGNED
   | typeof NumberProperty.TYPE_UNSIGNED

export type NumberType =
   | typeof NumberProperty.TYPE_INTEGER
   | typeof NumberProperty.TYPE_FLOAT

/**
 * Configuration dictionary for instantiating a `NumberProperty`.
 * Enforces numeric bounds, types (integer vs float), signs, and UI formatting.
 *
 * | Parameter | Type | Description | Default |
 * | :--- | :--- | :--- | :--- |
 * | `minVal` | number | The minimum allowed value (inclusive). | `undefined` |
 * | `maxVal` | number | The maximum allowed value (inclusive). | `undefined` |
 * | `sign` | NumberSign | Restricts the number to `signed` or `unsigned` (positive only). | `TYPE_SIGNED` |
 * | `type` | NumberType | The numeric type: `integer` (floored) or `float`. | `TYPE_INTEGER` |
 * | `prefix` | string | A string prepended to the formatted output (e.g., "$"). | `""` |
 * | `suffix` | string | A string appended to the formatted output (e.g., "kg"). | `""` |
 * | `precision` | number | Number of decimal places for floats. | `0` |
 */
export interface NumberPropertyType extends BasePropertyType {
   minVal?: number
   maxVal?: number
   sign?: NumberSign
   type?: NumberType
   prefix?: string
   suffix?: string
   precision?: number
}

/**
 * A property type strictly validating and formatting numeric values.
 * Allows enforcement of integers, positive-only limits, and boundary checking.
 * 
 * @example
 * ```typescript
 * const price = new NumberProperty({
 *    name: 'price',
 *    type: NumberProperty.TYPE_FLOAT,
 *    sign: NumberProperty.TYPE_UNSIGNED,
 *    prefix: '$',
 *    minVal: 0
 * });
 * 
 * price.set(19.99);
 * console.log(price.val(NumberProperty.TRANSFORM_FORMATTED)); // "$ 19.99"
 * price.set(-5); // Throws Error: Value must be unsigned
 * ```
 */
export class NumberProperty extends BaseProperty {
   /** The string literal type identifier for this property. */
   static TYPE = 'number'
   /** Constraint flag for signed numbers (positive and negative). */
   static TYPE_SIGNED = 'signed'
   /** Constraint flag for unsigned numbers (positive only). */
   static TYPE_UNSIGNED = 'unsigned'

   /** Type flag indicating an integer value. */
   static TYPE_INTEGER = 'integer'
   /** Type flag indicating a floating-point value. */
   static TYPE_FLOAT = 'float'

   /** Default separator used for string formatting. */
   static SEPARATOR = ' '

   /** Transformation identifier to return the number as a formatted string. */
   static TRANSFORM_FORMATTED = 'formatted'

   protected _minVal: number | undefined = undefined
   protected _maxVal: number | undefined = undefined
   protected _type: NumberType = NumberProperty.TYPE_INTEGER
   protected _sign: NumberSign = NumberProperty.TYPE_SIGNED
   protected _prefix: string = ''
   protected _suffix: string = ''
   protected _precision: number = 0

   declare protected _value: number | undefined

   constructor(config: NumberPropertyType) {
      super(config)
      this.minVal = config.minVal || undefined
      this.maxVal = config.maxVal || undefined
      this._prefix = config.prefix
         ? `${config.prefix}${NumberProperty.SEPARATOR}`
         : ''
      this._suffix = config.suffix
         ? `${NumberProperty.SEPARATOR}${config.suffix}`
         : ''
      if (config.type) {
         this._type = config.type
      }
      if (config.sign) {
         this._sign = config.sign
      }
   }

   /**
    * Assigns a new numeric value while strictly enforcing boundary, sign, and type constraints.
    * If configured as an integer, the input is floored.
    * 
    * @param value - The number to assign.
    * @param setChanged - Whether to mark the property as modified.
    * @returns The property instance for chaining.
    * @throws {Error} If the number violates the min, max, or sign constraints.
    */
   set(value: number, setChanged = true) {
      if (this._sign === NumberProperty.TYPE_UNSIGNED && value < 0) {
         throw new Error(`Value must be unsigned`)
      }

      if (this._minVal && value < this._minVal) {
         throw new Error(`Value is below ${this._minVal}`)
      }

      if (this._maxVal && value > this._maxVal) {
         throw new Error(`Value is above ${this._maxVal}`)
      }

      if (this._type === NumberProperty.TYPE_INTEGER) {
         value = Math.floor(value)
      }

      return super.set(value, setChanged)
   }

   /**
    * Retrieves the numeric value, optionally applying UI string formatting.
    * 
    * @param transform - Use `TRANSFORM_FORMATTED` to return a string with the configured prefix and suffix.
    * @returns The raw number or the formatted string representation.
    */
   val(transform: string | undefined = undefined) {
      switch (transform) {
         case NumberProperty.TRANSFORM_FORMATTED:
            return `${this._prefix}${this._value}${this._suffix}`

         default:
            return this._value
      }
   }

   set minVal(min: number | undefined) {
      this._minVal = min
   }

   get minVal() {
      return this._minVal
   }

   set maxVal(max: number | undefined) {
      this._maxVal = max
   }

   get maxVal() {
      return this._maxVal
   }

   get type() {
      return this._type
   }
}
