import { BackendAction, BackendParameters, BackendParametersKeys } from '../Backend';
import { DataObjectClass } from '../components/types/DataObjectClass';
import { BackendInterface } from './types/BackendInterface';
import { Filter } from './Filter';
import { Filters } from './Filters';
import { Query, QueryResultType } from './Query';
import { SortAndLimit } from './SortAndLimit';
import Middleware from './middlewares/Middleware';
export declare abstract class AbstractAdapter implements BackendInterface {
    protected _alias: string;
    protected _params: BackendParameters;
    protected _middlewares: Middleware[];
    constructor(params?: BackendParameters);
    setParam(key: BackendParametersKeys, value: any): void;
    getParam(key: BackendParametersKeys): any;
    addMiddleware(middleware: Middleware): void;
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
    abstract find(dataObject: DataObjectClass<any>, filters: Filters | Filter[] | undefined, pagination: SortAndLimit | undefined): Promise<QueryResultType<any>>;
    log(message: string): void;
    executeMiddlewares(dataObject: DataObjectClass<any>, action: BackendAction): Promise<DataObjectClass<any>>;
}
