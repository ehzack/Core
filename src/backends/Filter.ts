import { BaseObject } from '../components'
import { FilterOperatorType } from './FilterOperators'

export type FilterValueType<T extends BaseObject> =
   | T
   | number
   | string
   | string[]
   | null

export interface FilterType {
   prop: string
   operator: FilterOperatorType | undefined
   value: FilterValueType<any>
}

/**
 * Filter object
 */
export class Filter implements FilterType {
   prop: string
   operator: FilterOperatorType
   value: FilterValueType<any>

   constructor(
      prop: string,
      value: FilterValueType<any>,
      operator: FilterOperatorType = 'equals'
   ) {
      this.prop = prop
      this.operator = operator
      this.value = value
   }
}
