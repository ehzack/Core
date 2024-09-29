import { BaseObjectCore } from '@quatrain/core';
import { FilterOperatorType } from './FilterOperators';
export type FilterValueType<T extends BaseObjectCore> = T | number | string | string[] | null;
export interface FilterType {
    prop: string;
    operator: FilterOperatorType | undefined;
    value: FilterValueType<any>;
}
/**
 * Filter object
 */
export declare class Filter implements FilterType {
    prop: string;
    operator: FilterOperatorType;
    value: FilterValueType<any>;
    constructor(prop: string, value: FilterValueType<any>, operator?: FilterOperatorType);
}
