import { Query, QueryResultType } from '../backends/Query';
import { BaseObjectCore } from './BaseObjectCore';
import { DataObjectClass } from './types/DataObjectClass';
import { BaseObject } from './BaseObject';
import { BackendInterface } from '../backends/types/BackendInterface';
/**
 * CRUD methods for models/entities inheriting from BaseObject
 * Extend this by passing the typeof of the desired class to the constructor
 */
export default class BaseRepository<T extends BaseObject> {
    protected _model: typeof BaseObjectCore;
    backendAdapter: BackendInterface;
    constructor(model: typeof BaseObjectCore, backendAdapter?: BackendInterface);
    protected getDataObjectFromUid(uid: string): Promise<DataObjectClass<any>>;
    create<B extends BaseObjectCore>(obj: B, uid?: string): Promise<any>;
    read(key: string): Promise<any>;
    update(obj: BaseObjectCore): Promise<any>;
    /**
     * delete object in its backend
     * @param uid string
     */
    delete(uid: string): Promise<DataObjectClass<any>>;
    query(query: Query<any>): Promise<QueryResultType<T>>;
}
