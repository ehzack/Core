export enum FilterOperator {
   equals,
   notEquals,
   greater,
   greaterOrEquals,
   lower,
   lowerOrEquals,
   contains,
   notContains,
   containsAll,
   containsAny,
}

export type FilterOperatorType =
   | 'equals'
   | 'notEquals'
   | 'greater'
   | 'greaterOrEquals'
   | 'lower'
   | 'lowerOrEquals'
   | 'contains'
   | 'notContains'
   | 'containsAll'
   | 'containsAny'
