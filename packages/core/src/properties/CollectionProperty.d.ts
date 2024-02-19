import { BaseProperty, BasePropertyType } from './BaseProperty';
import { Query, QueryResultType } from '../backends/Query';
import { Filter } from '../backends/Filter';
import { ObjectUri } from '../components/ObjectUri';
import { returnAs } from '../backends/Query';
import { DataObjectClass } from '../components/types/DataObjectClass';
import { BaseObjectCore } from '../components';
export interface CollectionPropertyType extends BasePropertyType {
    instanceOf: typeof BaseObjectCore;
    backend?: any;
    parentKey?: string;
}
export declare class CollectionProperty extends BaseProperty {
    static TYPE: string;
    protected _value: Array<any> | Array<DataObjectClass<any>> | Array<ObjectUri> | undefined;
    protected _instanceOf: typeof BaseObjectCore;
    protected _backend: any;
    protected _parentKey: string;
    protected _query: Query<any>;
    protected _filters: Filter[] | Filter | undefined;
    constructor(config: CollectionPropertyType);
    protected _setQuery(filters?: Filter[]): Query<typeof BaseObjectCore>;
    set(value: Array<any>): this;
    /**
     * get objects matching collection class and filters
     * in the requested format
     * @param filters
     * @returns
     */
    get(filters?: Filter[] | undefined): Query<any>;
    val(transform?: returnAs): Promise<QueryResultType<any>>;
    toJSON(): any[] | DataObjectClass<any>[] | ObjectUri[] | undefined;
}
