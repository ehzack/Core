import { Filter } from './Filter';
export interface FiltersType {
    or?: Filter[];
    and?: Filter[];
}
export declare class Filters implements FiltersType {
    or?: Filter[];
    and?: Filter[];
    constructor(or: Filter[] | undefined, and: Filter[] | undefined);
}
