import { Filter } from './Filter'
import { Limits } from './Limits'
import { Sorting } from './Sorting'
import { SortAndLimit } from './SortAndLimit'
import { BackendInterface } from './AbstractAdapter'
import { BaseObject } from '../components'

export class Query<T extends BaseObject> {
   protected _obj: T
   protected _params: any
   filters: Filter[]
   sortings: Sorting[]
   limits: Limits

   constructor(obj: T, params: { [x: string]: any } = {}) {
      this._obj = obj
      //Object.keys(params).forEach((key: string) => (obj[key] = params[key]))
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

   async execute(backend: BackendInterface<T>) {
      return await backend.find(
         this._obj.dataObject,
         this.filters,
         this.sortAndLimit
      )
   }
}
