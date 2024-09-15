import {
   CollectionPropertyType,
   Core,
   CollectionProperty as CPCore,
   returnAs,
} from '@quatrain/core'
import { Backend } from './Backend'
import { Filter } from './Filter'
import { Query, QueryResultType } from './Query'
import { BaseObjectCore } from './BaseObjectCore'

export class CollectionProperty extends CPCore {
   protected _instanceOf: typeof BaseObjectCore
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

   set(value: Array<any>, setChanged = true) {
      return super.set(value, setChanged)
   }

   /**
    * get objects matching collection class and filters
    * in the requested format
    * @param filters
    * @returns
    */
   get(filters: Filter[] | undefined = undefined): Query<any> {
      if (!this._query || this._filters !== filters) {
         this._query = this._setQuery(filters)
      }

      return this._query
   }

   async val(
      transform: returnAs = returnAs.AS_DATAOBJECTS
   ): Promise<QueryResultType<any>> {
      return await this.get().execute(transform, this._backend)
   }

   toJSON() {
      return this._value
   }
}
