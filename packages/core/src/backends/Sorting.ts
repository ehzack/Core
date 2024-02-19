export interface SortingType {
   prop: string
   order: 'asc' | 'desc'
}

export class Sorting implements SortingType {
   prop: string
   order: 'asc' | 'desc'

   constructor(prop: string, order: 'asc' | 'desc' = 'asc') {
      this.prop = prop
      this.order = order
   }
}
