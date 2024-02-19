import { Filter } from './Filter'

export interface FiltersType {
   or?: Filter[]
   and?: Filter[]
}

export class Filters implements FiltersType {
   or?: Filter[]
   and?: Filter[]

   constructor(or: Filter[] | undefined, and: Filter[] | undefined) {
      if (or) {
         this.or = or
      }
      if (and) {
         this.and = and
      }
   }
}
