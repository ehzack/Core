import { BaseProperty, BasePropertyType } from './BaseProperty'
import { ObjectUri } from '../components/ObjectUri'
import { Core } from '../Core'
import { DataObjectClass } from '../components/types/DataObjectClass'
import { BaseObject } from '../components/BaseObject'

/**
 * Configuration dictionary for instantiating a core `CollectionProperty`.
 * Defines a relationship containing multiple objects.
 *
 * | Parameter | Type | Description | Default |
 * | :--- | :--- | :--- | :--- |
 * | `instanceOf` | typeof BaseObject | The class of the objects contained in this collection. | **Required** |
 * | `backend` | any | An optional specific backend instance for persistence handling. | `undefined` |
 * | `parentKey` | string | The foreign key field pointing back to the parent. | `parent.uri.collection` |
 */
export interface CollectionPropertyType extends BasePropertyType {
   instanceOf: typeof BaseObject
   backend?: any
   parentKey?: string
}

/**
 * A basic relational property type representing a collection of `BaseObject` instances.
 * This core class manages the in-memory array representation. For dynamic querying, see the backend `CollectionProperty`.
 * 
 * @example
 * ```typescript
 * const permissions = new CollectionProperty({
 *    name: 'permissions',
 *    instanceOf: Permission
 * });
 * ```
 */
export class CollectionProperty extends BaseProperty {
   /** The string literal type identifier for this property. */
   static TYPE = 'collection'
   protected _value:
      | Array<any>
      | Array<DataObjectClass<any>>
      | Array<ObjectUri>
      | undefined = undefined
   protected _instanceOf: typeof BaseObject
   protected _parentKey: string

   constructor(config: CollectionPropertyType) {
      super(config)
      if (!config.instanceOf) {
         throw new Error(`Parameter 'instanceOf' is mandatory`)
      }
      this._instanceOf =
         typeof config.instanceOf === 'string'
            ? Core.classRegistry[config.instanceOf]
            : config.instanceOf
      this._parentKey =
         config.parentKey || this._parent?.uri?.collection || 'unknown'
   }

   /**
    * Assigns an array of related objects or URIs to the collection.
    * 
    * @param value - The array of elements to assign.
    * @param setChanged - Whether to mark the property as modified.
    * @returns The property instance for chaining.
    */
   set(value: Array<any>, setChanged = true) {
      return super.set(value, setChanged)
   }

   /**
    * Serializes the collection for JSON output.
    * 
    * @returns The raw array of values.
    */
   toJSON() {
      return this._value
   }
}
