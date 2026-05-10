import { FilterOperatorType } from './FilterOperators'
import { PersistedBaseObject } from './PersistedBaseObject'

export type FilterValueType<T extends PersistedBaseObject> =
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
 * Represents a single atomic filtering condition for a database query.
 */
export class Filter implements FilterType {
   /** The precise property name in the collection to apply the filter against. */
   prop: string
   /** The logic operator evaluating the condition (e.g., 'equals', 'greater', 'contains'). */
   operator: FilterOperatorType
   /** The raw value, array of values, or object reference to compare against. */
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
