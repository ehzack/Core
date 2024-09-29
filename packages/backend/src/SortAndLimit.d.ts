import { Limits } from './Limits';
import { Sorting } from './Sorting';
export interface SortAndLimitType {
    sortings: Sorting[];
    limits: Limits;
}
export declare class SortAndLimit implements SortAndLimitType {
    sortings: Sorting[];
    limits: Limits;
    constructor(sortings?: Sorting[], limits?: Limits | undefined);
}
