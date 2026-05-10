import { ObjectUri } from '../components/ObjectUri'
import { BaseProperty, BasePropertyType } from './BaseProperty'
import { BaseObjectClass } from '../components/types/BaseObjectClass'

/**
 * Configuration dictionary for instantiating a `FileProperty`.
 * Inherits all core parameters from `BasePropertyType`.
 */
export interface FilePropertyType extends BasePropertyType {}

/**
 * A property type designed to hold a reference to a File or Blob.
 * It usually stores either the raw `BaseObjectClass` representing the file, or an `ObjectUri` pointing to the storage location.
 * 
 * @example
 * ```typescript
 * const avatar = new FileProperty({
 *    name: 'avatar'
 * });
 * ```
 */
export class FileProperty extends BaseProperty {
   /** The string literal type identifier for this property. */
   static TYPE = 'file'
   /** The internal stored value, either a class instance or a URI. */
   _value: BaseObjectClass | ObjectUri | undefined = undefined

   constructor(config: FilePropertyType) {
      super(config)
   }
}
