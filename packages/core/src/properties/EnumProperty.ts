import { BaseProperty, BasePropertyType } from './BaseProperty'

/**
 * Configuration dictionary for instantiating an `EnumProperty`.
 * Restricts the property value to a specific set of allowed strings.
 *
 * | Parameter | Type | Description | Default |
 * | :--- | :--- | :--- | :--- |
 * | `values` | string[] | Array of acceptable string values. | `[]` |
 */
export interface EnumPropertyType extends BasePropertyType {
   values?: string[]
}

/**
 * A property type that validates string values against a strict list of allowed options.
 * Useful for status fields, categories, or predefined states.
 * 
 * @example
 * ```typescript
 * const status = new EnumProperty({
 *    name: 'status',
 *    values: ['pending', 'active', 'deleted']
 * });
 * 
 * status.set('active'); // OK
 * status.set('archived'); // Throws Error: Value 'archived' is not acceptable
 * ```
 */
export class EnumProperty extends BaseProperty {
   /** Special wildcard value allowing any string to be accepted if configured in `values`. */
   static WILDCARD = '*'
   /** The string literal type identifier for this property. */
   static TYPE = 'enum'
   protected _values: string[] = []

   constructor(config: EnumPropertyType) {
      super(config)
      this._values = config.values || []
   }

   /**
    * Assigns a new value, validating it against the allowed enum values.
    * If the wildcard (`*`) is present in the allowed values, any value is accepted.
    * 
    * @param value - The enum string to assign.
    * @param setChanged - Whether to mark the property as modified.
    * @returns The property instance for chaining.
    * @throws {Error} If the value is not in the allowed list.
    */
   set(value: string, setChanged = true) {
      if (
         value !== null &&
         (!this._values.includes(EnumProperty.WILDCARD) &&
            !this._values.includes(value))
      ) {
         throw new Error(
            `Value '${value}' is not acceptable, acceptable values are: ${this._values.join(
               ', '
            )}`
         )
      }

      return super.set(value, setChanged)
   }

   get values() {
      return this._values
   }
}
