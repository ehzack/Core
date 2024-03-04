import { Filter } from './Filter'

export interface FiltersType {
   or?: Filter[]
   and?: Filter[]
   base?: string
}

export class Filters implements FiltersType {
   or?: Filter[]
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
