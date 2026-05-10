export interface SortingType {
   prop: string
   order: 'asc' | 'desc'
}

/**
 * Represents a single sorting rule applied to a Query.
 * Specifies the target property name and the sorting direction.
 */
export class Sorting implements SortingType {
   /** The exact property name in the collection to sort by. */
   prop: string
   /** The sorting order, either ascending (`asc`) or descending (`desc`). */
   order: 'asc' | 'desc'

   constructor(prop: string, order: 'asc' | 'desc' = 'asc') {
      this.prop = prop
      this.order = order
   }
}
