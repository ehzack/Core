import { Filter } from './Filter';
export interface FiltersType {
    or?: Filter[];
    and?: Filter[];
    base?: string;
}
export declare class Filters implements FiltersType {
    or?: Filter[];
    and?: Filter[];
    constructor(or?: Filter[], and?: Filter[]);
}
