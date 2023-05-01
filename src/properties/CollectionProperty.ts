import { BaseProperty, BasePropertyType } from './BaseProperty'
import { Query, Filter } from '../backends'
import { DataObject, ObjectUri } from '../components'
import { Core } from '../Core'
import { returnAs } from '../backends/Query'

export interface CollectionPropertyType extends BasePropertyType {
   instanceOf?: Function | string | Object
   backend?: string
   parentKey?: string
}

export class CollectionProperty extends BaseProperty {
   static TYPE = 'collection'
   protected _value:
      | Array<any>
      | Array<DataObject>
      | Array<ObjectUri>
      | undefined = undefined
   protected _instanceOf: any
   protected _backend: undefined
   protected _parentKey: string
   protected _query: Query<any> | undefined = undefined
   protected _filters: Filter[] | Filter | undefined = undefined

   constructor(config: CollectionPropertyType) {
      super(config)
      this._instanceOf = config.instanceOf
      this._backend = config.backend
         ? Core.getBackend(config.backend)
         : undefined
      this._parentKey =
         config.parentKey || this._parent?.uri?.collection || 'unknown'
   }

   set(value: Array<any>) {
      return super.set(value)
   }

   /**
    * get objects matching collection class and filters
    * in the requested format
    * @param filters
    * @returns
    */
   get(filters: Filter[] | undefined = undefined): Query<any> {
      if (!this._query || this._filters !== filters) {
         this._query = new Query(this._instanceOf)
         if (this._parent) {
            this._query.where(this._parentKey, this._parent.uri)
         }
         if (filters) {
            this._query.filters = filters
         }
      }
      return this._query
   }

   async val(
      transform: returnAs = returnAs.AS_DATAOBJECTS
   ): Promise<Array<any> | Array<DataObject> | Array<ObjectUri>> {
      return await this.get().execute(transform, this._backend)
   }

   toJSON() {
      return this._value
   }
}
