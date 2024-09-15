import { BackendAction } from '../Backend';
import { DataObjectClass } from '@quatrain/core';
export default interface BackendMiddleware {
    execute: (dataObject: DataObjectClass<any>, action: BackendAction, params?: any) => void;
}
