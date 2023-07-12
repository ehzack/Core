import { Filter } from './Filter'
import { Limits } from './Limits'
import { Sorting } from './Sorting'
import { SortAndLimit } from './SortAndLimit'
import { BackendInterface } from './AbstractAdapter'
import { Core } from '../Core'
import { DataObjectClass, ObjectUri } from '../components'
import { Persisted } from '../components/types/Persisted'
import { BaseObject } from '../components/BaseObject'
import { BaseObjectCore } from '../components/BaseObjectCore'

export const AS_OBJECTURIS = 'objectUris'
export const AS_DATAOBJECTS = 'dataObjects'
export const AS_INSTANCES = 'classInstances'

export enum returnAs {
   AS_OBJECTURIS = 'objectUris',
   AS_DATAOBJECTS = 'dataObjects',
   AS_INSTANCES = 'classInstances',
}

export class Query<T extends typeof BaseObjectCore> {
   protected _obj: T
   protected _params: any
   filters: Filter[]
   sortings: Sorting[]
   limits: Limits

   constructor(obj: T, params: { [x: string]: any } = {}) {
      this._obj = obj
      this._params = params // just in case
      this.filters = []
      this.sortings = []
      this.limits = new Limits()
   }

   get obj() {
      return this._obj
   }

   where(param: Filter | string, value: any = null, operator: any = 'equals') {
      if (typeof param == 'object') {
         this.filters.push(param)
      } else {
         if (operator === 'equals' && Array.isArray(value)) {
            // auto-convert operator if value is an array
            operator = 'containsAny'
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
   ): Promise<DataObjectClass<any>[]> {
      return backend.query(this)
   }

   async fetchAsUri(
      backend: BackendInterface = Core.getBackend()
   ): Promise<ObjectUri[]> {
      const result = await this.fetch(backend)

      return await Promise.all(result.map((dao) => dao.uri))
   }

   async fetchAsInstances(
      backend: BackendInterface = Core.getBackend()
   ): Promise<Persisted<BaseObject>[]> {
      const result = await this.fetch(backend)

      const instances = []

      for (const item of result) {
         instances.push(this._obj.fromDataObject(item))
      }

      return instances
   }

   async execute(
      as: returnAs = returnAs.AS_DATAOBJECTS,
      backend: BackendInterface = Core.getBackend()
   ): Promise<DataObjectClass<any>[] | ObjectUri[] | Persisted<BaseObject>[]> {
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
