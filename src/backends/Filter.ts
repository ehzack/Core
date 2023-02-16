import { FilterOperatorType } from './FilterOperators'

export interface FilterType {
   prop: string
   operator: FilterOperatorType | undefined
   value: number | string | string[] | undefined
}

/**
 * Filter object
 */
export class Filter implements FilterType {
   prop: string
   operator: FilterOperatorType
   value: number | string | string[] | undefined

   constructor(
      prop: string,
      value: number | string | string[] | undefined = undefined,
      operator: FilterOperatorType = 'equals',
   ) {
      this.prop = prop
      this.operator = operator
      this.value = value
   }
}
