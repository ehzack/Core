import { Filter } from './Filter';
import { Limits } from './Limits';
import { Sorting } from './Sorting';
import { SortAndLimit } from './SortAndLimit';
import { BackendInterface } from './types/BackendInterface';
import { DataObjectClass, ObjectUri } from '../components';
import { BaseObjectCore } from '../components/BaseObjectCore';
export declare const AS_OBJECTURIS = "objectUris";
export declare const AS_DATAOBJECTS = "dataObjects";
export declare const AS_INSTANCES = "classInstances";
export type QueryMetaType = {
    count: number;
    offset: number;
    batch: number;
    executionTime: string | number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
};
export type QueryResultType<T> = {
    items: Array<T>;
    meta: QueryMetaType;
};
export declare enum returnAs {
    AS_OBJECTURIS = "objectUris",
    AS_DATAOBJECTS = "dataObjects",
    AS_INSTANCES = "classInstances",
    AS_IS = "asIs"
}
export declare class Query<T extends typeof BaseObjectCore> {
    protected _obj: T;
    protected _params: any;
    filters: Filter[];
    sortings: Sorting[];
    limits: Limits;
    meta: any;
    constructor(obj: T, params?: {
        [x: string]: any;
    });
    get obj(): T;
    where(param: Filter | string, value?: any, operator?: any): this;
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
