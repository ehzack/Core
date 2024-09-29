import { BackendAction, BackendParameters, BackendParametersKeys } from './Backend';
import { DataObjectClass } from '@quatrain/core';
import { BackendInterface } from './types/BackendInterface';
import { Filter } from './Filter';
import { Filters } from './Filters';
import { Query, QueryResultType } from './Query';
import { SortAndLimit } from './SortAndLimit';
import BackendMiddleware from './middlewares/Middleware';
import { MiddlewareParams } from './middlewares/types/MiddlewareParams';
interface BM extends BackendMiddleware {
}
export declare abstract class AbstractBackendAdapter implements BackendInterface {
    static PKEY_IDENTIFIER: any;
    protected _alias: string;
    protected _params: BackendParameters;
    protected _middlewares: BM[];
    constructor(params?: BackendParameters);
    setParam(key: BackendParametersKeys, value: any): void;
    getParam(key: BackendParametersKeys): any;
    addMiddleware(middleware: BM): void;
    /**
     * Returns true if a given middleware is attached
     * @param className
     * @returns boolean
     */
    hasMiddleware(className: string): boolean;
    set alias(alias: string);
    get alias(): string;
    getCollection(dao: DataObjectClass<any>): string | undefined;
    abstract create(dataObject: DataObjectClass<any>, desiredUid?: string | undefined): Promise<DataObjectClass<any>>;
    abstract read(dataObject: DataObjectClass<any>): Promise<DataObjectClass<any>>;
    abstract update(dataObject: DataObjectClass<any>): Promise<DataObjectClass<any>>;
    abstract delete(dataObject: DataObjectClass<any>): Promise<DataObjectClass<any>>;
    abstract deleteCollection(collection: string, batchSize?: number): Promise<void>;
    /**
     * Process Query instance and return result
     * @param query
     * @returns Array
     */
    query(query: Query<any>): Promise<QueryResultType<DataObjectClass<any>>>;
    abstract find(dataObject: DataObjectClass<any>, filters: Filters | Filter[] | undefined, pagination: SortAndLimit | undefined, parent: any): Promise<QueryResultType<any>>;
    log(message: string): void;
    executeMiddlewares(dataObject: DataObjectClass<any>, action: BackendAction, params?: MiddlewareParams): Promise<DataObjectClass<any>>;
}
export {};
