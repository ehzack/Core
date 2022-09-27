import { Limits } from './Limits'
import { Sorting } from './Sorting'

export interface SortAndLimitType {
   sortings: Sorting[]
   limits: Limits
}

export class SortAndLimit implements SortAndLimitType {
   sortings: Sorting[]
   limits: Limits

   constructor(
      sortings: Sorting[] = [],
      limits: Limits | undefined = undefined,
   ) {
      this.sortings = sortings
      this.limits = limits || new Limits()
   }
}
