export interface LimitsType {
    offset: number;
    batch: number;
}
export declare class Limits implements LimitsType {
    offset: number;
    batch: number;
    constructor(offset?: number, batch?: number);
}
