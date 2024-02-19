export interface SortingType {
    prop: string;
    order: 'asc' | 'desc';
}
export declare class Sorting implements SortingType {
    prop: string;
    order: 'asc' | 'desc';
    constructor(prop: string, order?: 'asc' | 'desc');
}
