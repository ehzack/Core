export enum FilterOperator {
   equals,
   notEquals,
   greater,
   greaterOrEquals,
   lower,
   lowerOrEquals,
   like,
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
   | 'like'
   | 'contains'
   | 'notContains'
   | 'containsAll'
   | 'containsAny'
   | 'isNull'
   | 'isNotNull'
