import {
   BaseProperty,
   BasePropertyType,
   Core,
   ObjectUri,
   returnAs,
} from '@quatrain/core'
import { Backend } from './Backend'
import { Filter } from './Filter'
import { Query, QueryResultType } from './Query'
import { PersistedBaseObject } from './PersistedBaseObject'
import { DataObjectClass } from './types/DataObjectClass'

/**
 * Configuration dictionary for instantiating a backend `CollectionProperty`.
 * This extends `BasePropertyType` with specific relational and backend-aware parameters.
 *
 * | Parameter | Type | Description | Default |
 * | :--- | :--- | :--- | :--- |
 * | `instanceOf` | typeof PersistedBaseObject | The class of the objects contained in this collection. | **Required** |
 * | `backend` | any | An optional specific backend instance to query. If omitted, uses the default backend. | `undefined` |
 * | `parentKey` | string | The foreign key field on the child objects pointing back to the parent. | `parent.uri.collection` |
 */
export interface CollectionPropertyType extends BasePropertyType {
   instanceOf: typeof PersistedBaseObject
   backend?: any
   parentKey?: string
}

/**
 * A specialized backend property that represents a one-to-many or many-to-many relationship.
 * Unlike the core `CollectionProperty`, this property acts as a dynamic query builder,
 * fetching related `PersistedBaseObject` instances directly from the database when accessed.
 * 
 * @example
 * ```typescript
 * const users = new CollectionProperty({
 *    name: 'employees',
 *    instanceOf: User,
 *    parentKey: 'companyUri' // The field in 'User' that stores the company ID
 * });
 * 
 * // Fetch the collection from the database
 * const results = await users.val();
 * console.log(results); // Array of User objects
 * ```
 */
export class CollectionProperty extends BaseProperty {
   static TYPE = 'collection'
   protected _value:
      | Array<any>
      | Array<DataObjectClass<any>>
      | Array<ObjectUri>
      | undefined = undefined
   protected _instanceOf: typeof PersistedBaseObject
   protected _parentKey: string
   protected _backend: any
   protected _query: Query<any>
   protected _filters: Filter[] | Filter | undefined = undefined

   constructor(config: CollectionPropertyType) {
      super(config)
      this._instanceOf =
         typeof config.instanceOf === 'string'
            ? Core.classRegistry[config.instanceOf]
            : config.instanceOf
      this._backend = config.backend
         ? Backend.getBackend(config.backend)
         : undefined
      this._parentKey =
         config.parentKey || this._parent?.uri?.collection || 'unknown'
      this._query = this._setQuery()
   }

   protected _setQuery(filters?: Filter[]) {
      const query = this._instanceOf.query()
      query.where(this._parentKey, this._parent ? this._parent.uri : 'unknown')
      if (filters) {
         query.filters = filters
      }

      return query
   }

   /**
    * Overrides the default set method. Normally, a backend collection's value
    * is retrieved dynamically via queries, but it can be manually hydrated.
    * 
    * @param value - The array of objects or URIs to set.
    * @param setChanged - Whether to mark the property as modified.
    * @returns The property instance for chaining.
    */
   set(value: Array<any>, setChanged = true) {
      return super.set(value, setChanged)
   }

   /**
    * Constructs or retrieves the backend query builder for this collection.
    * This allows chaining further database conditions before execution.
    * 
    * @param filters - Optional array of filters to apply to the collection query.
    * @returns A Query object ready to be executed against the backend.
    */
   get(filters: Filter[] | undefined = undefined): Query<any> {
      if (!this._query || this._filters !== filters) {
         this._query = this._setQuery(filters)
      }

      return this._query
   }

   /**
    * Executes the backend query and resolves the collection of related objects.
    * 
    * @param transform - The format in which the results should be returned (e.g. AS_DATAOBJECTS).
    * @returns A promise resolving to the query result containing the objects.
    */
   async val(
      transform: returnAs = returnAs.AS_DATAOBJECTS
   ): Promise<QueryResultType<any>> {
      return await this.get().execute(transform, this._backend)
   }

   /**
    * Serializes the current explicitly set value of the collection.
    * Note: This does not trigger a database fetch.
    * 
    * @returns The raw internal value array.
    */
   toJSON() {
      return this._value
   }
}
