import { DataObjectClass } from '../../components';
import { BackendAction } from '../../Backend';
import { User } from '../../components/User';
import Middleware from './Middleware';
export interface InjectMetaMiddlewareParams {
    user: User;
}
export declare class InjectMetaMiddleware implements Middleware {
    protected _user: User;
    constructor(params: InjectMetaMiddlewareParams);
    execute(dataObject: DataObjectClass<any>, action: BackendAction): void;
}
