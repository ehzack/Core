import { Filter } from './Filter';
import { Limits } from './Limits';
import { Sorting } from './Sorting';
import { SortAndLimit } from './SortAndLimit';
import { BackendInterface } from './types/BackendInterface';
import { DataObjectClass, ObjectUri, BaseObjectCore, returnAs } from '@quatrain/core';
export declare const AS_OBJECTURIS = "objectUris";
export declare const AS_DATAOBJECTS = "dataObjects";
export declare const AS_INSTANCES = "classInstances";
export type OperatorKeys = 'equals' | 'notEquals' | 'greater' | 'greaterOrEquals' | 'lower' | 'lowerOrEquals' | 'contains' | 'notContains' | 'containsAll' | 'containsAny';
export type QueryMetaType = {
    count: number;
    offset: number;
    batch: number;
    executionTime: string | number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    debug?: any;
};
export type QueryResultType<T> = {
    items: Array<T>;
    meta: QueryMetaType;
};
export declare class Query<T extends typeof BaseObjectCore> {
    protected _obj: T;
    protected _parent: T | undefined;
    filters: Filter[];
    sortings: Sorting[];
    limits: Limits;
    meta: any;
    constructor(obj: T, parent?: T);
    get obj(): T;
    get parent(): T | undefined;
    /**
     * Declare query parent record
     * This may be need in some NoSQL backend to query subcollections
     */
    set parent(parent: T | undefined);
    where(param: Filter | string | any, value?: any, operator?: OperatorKeys): this;
    sortBy(param: Sorting | string, order?: any): this;
    setLimits(limits: Limits): this;
    offset(offset?: number): this;
    batch(batch?: number): this;
    get sortAndLimit(): SortAndLimit;
    fetch(backend?: BackendInterface): Promise<QueryResultType<DataObjectClass<any>>>;
    fetchAsUri(backend?: BackendInterface): Promise<QueryResultType<ObjectUri>>;
    fetchAsInstances(backend?: BackendInterface): Promise<QueryResultType<T>>;
    execute(as?: returnAs, backend?: BackendInterface): Promise<QueryResultType<any>>;
}
