import { DataObjectClass } from '../../components';
import { BackendAction } from '../../Backend';
import Middleware from './Middleware';
export interface InjectKeywordsMiddlewareParams {
}
export declare class InjectKeywordsMiddleware implements Middleware {
    execute(dataObject: DataObjectClass<any>, action: BackendAction): void;
    protected _createKeywords(dataObject: DataObjectClass<any>): string[];
}
