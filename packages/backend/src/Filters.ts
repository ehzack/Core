import { Filter } from './Filter'

export interface FiltersType {
   or?: Filter[]
   and?: Filter[]
   base?: string
}

/**
 * Aggregates multiple `Filter` instances into logical groups (`OR`, `AND`).
 * Used heavily by the `Query` builder for advanced search criteria.
 */
export class Filters implements FiltersType {
   /** Array of filters evaluated with an inclusive OR logical operator. */
   or?: Filter[]
   /** Array of filters evaluated with a strict AND logical operator. */
   and?: Filter[]

   constructor(or?: Filter[], and?: Filter[]) {
      if (or) {
         this.or = or
      }
      if (and) {
         this.and = and
      }
   }
}
