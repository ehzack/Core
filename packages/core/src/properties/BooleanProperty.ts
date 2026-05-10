import { BaseProperty, BasePropertyType } from './BaseProperty'

/**
 * Configuration dictionary for instantiating a `BooleanProperty`.
 * Inherits all core parameters from `BasePropertyType` with no additional constraints.
 */
export interface BooleanPropertyType extends BasePropertyType {}

/**
 * A property type strictly handling boolean values (`true` or `false`).
 * 
 * @example
 * ```typescript
 * const isActive = new BooleanProperty({
 *    name: 'isActive',
 *    defaultValue: false
 * });
 * 
 * isActive.set(true);
 * console.log(isActive.val()); // true
 * ```
 */
export class BooleanProperty extends BaseProperty {
   /** The string literal type identifier for this property. */
   static TYPE = 'boolean'

   /**
    * Assigns a new boolean value to the property.
    * 
    * @param value - The boolean value to assign.
    * @param setChanged - Whether to mark the property as modified.
    * @returns The property instance for chaining.
    */
   set(value: boolean, setChanged = true) {
      return super.set(value, setChanged)
   }
}
