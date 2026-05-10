import { Limits } from './Limits'
import { Sorting } from './Sorting'

export interface SortAndLimitType {
   sortings: Sorting[]
   limits: Limits
}

/**
 * Aggregates sorting and pagination limit rules into a single structure
 * used by Query and Backend Adapters to process list requests.
 */
export class SortAndLimit implements SortAndLimitType {
   /** Array of property sorting definitions applied sequentially. */
   sortings: Sorting[]
   /** Pagination rules defining batch size and offset. */
   limits: Limits

   constructor(
      sortings: Sorting[] = [],
      limits: Limits | undefined = undefined,
   ) {
      this.sortings = sortings
      this.limits = limits || new Limits()
   }
}
