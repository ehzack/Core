import { Filter } from './Filter'
import { Limits } from './Limits'
import { Sorting } from './Sorting'
import { SortAndLimit } from './SortAndLimit'
import { BackendInterface } from './types/BackendInterface'
import { Core } from '../Core'
import { DataObjectClass, ObjectUri } from '../components'
import { BaseObjectCore } from '../components/BaseObjectCore'

export const AS_OBJECTURIS = 'objectUris'
export const AS_DATAOBJECTS = 'dataObjects'
export const AS_INSTANCES = 'classInstances'

export type QueryMetaType = {
   count: number
   offset: number
   batch: number
   executionTime: string | number
   sortField?: string
   sortOrder?: 'asc' | 'desc'
}

export type QueryResultType<T> = {
   items: Array<T>
   meta: QueryMetaType
}

export enum returnAs {
   AS_OBJECTURIS = 'objectUris',
   AS_DATAOBJECTS = 'dataObjects',
   AS_INSTANCES = 'classInstances',
   AS_IS = 'asIs',
}

export class Query<T extends typeof BaseObjectCore> {
   protected _obj: T
   protected _parent: T | undefined
   filters: Filter[]
   sortings: Sorting[]
   limits: Limits
   meta: any

   constructor(obj: T, parent?: T) {
      this._obj = obj
      this._parent = parent
      this.filters = []
      this.sortings = []
      this.limits = new Limits()
      this.meta = {}
   }

   get obj() {
      return this._obj
   }

   get parent(): T | undefined {
      return this._parent
   }

   /**
    * Declare query parent record
    * This may be need in some NoSQL backend to query subcollections
    */
   set parent(parent: T | undefined) {
      this._parent = parent
   }

   where(param: Filter | string | any, value: any = null, operator: any = 'equals') {
      if (typeof param == 'object') {
         this.filters.push(param)
      } else {
         if (operator === 'equals' && Array.isArray(value)) {
            // auto-convert operator if value is an array
            operator = 'contains' // Any'
         }
         this.filters.push(new Filter(param, value, operator))
      }

      return this
   }

   sortBy(param: Sorting | string, order: any = 'asc') {
      if (typeof param == 'object') {
         this.sortings.push(param)
      } else {
         this.sortings.push(new Sorting(param, order))
      }

      return this
   }

   setLimits(limits: Limits) {
      this.limits = limits
      return this
   }

   offset(offset: number = 0) {
      this.limits.offset = offset
      return this
   }

   batch(batch: number = 10) {
      this.limits.batch = batch
      return this
   }

   get sortAndLimit() {
      return new SortAndLimit(this.sortings, this.limits)
   }

   async fetch(
      backend: BackendInterface = Core.getBackend()
   ): Promise<QueryResultType<DataObjectClass<any>>> {
      return backend.query(this)
   }

   async fetchAsUri(
      backend: BackendInterface = Core.getBackend()
   ): Promise<QueryResultType<ObjectUri>> {
      const { items, meta } = await this.fetch(backend)

      return { items: await Promise.all(items.map((dao) => dao.uri)), meta }
   }

   async fetchAsInstances(
      backend: BackendInterface = Core.getBackend()
   ): Promise<QueryResultType<T>> {
      const { items, meta } = await this.fetch(backend)

      const instances = []

      for (const item of items) {
         instances.push(this._obj.fromDataObject(item))
      }

      return { items: instances, meta }
   }

   async execute(
      as: returnAs = returnAs.AS_DATAOBJECTS,
      backend: BackendInterface = Core.getBackend(this._obj.DEFAULT_BACKEND)
   ): Promise<QueryResultType<any>> {
      //<DataObjectClass<any>[] | ObjectUri[] | Persisted<BaseObject>[]> {
      //</any><Array<T2> | Array<DataObject> | Array<ObjectUri>> {
      try {
         switch (as) {
            case AS_DATAOBJECTS:
               return await this.fetch(backend)

            case AS_OBJECTURIS:
               return await this.fetchAsUri(backend)

            case AS_INSTANCES:
               return await this.fetchAsInstances(backend)

            default:
               throw new Error(`Unknown output mode`)
         }
      } catch (err) {
         console.log(err)
         throw err
      }
   }
}
