import Middleware from "./backends/middlewares/Middleware";
export declare enum BackendAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete"
}
/**
 * Default interface for a backend record
 */
export interface BackendRecordType {
    uid: string | undefined;
    path: string | undefined;
    [key: string]: any;
}
/**
 * Backend Parameters acceptable keys
 */
export type BackendParametersKeys = 'host' | 'alias' | 'mapping' | 'middlewares' | 'config' | 'fixtures' | 'softDelete' | 'debug';
/**
 * Backend parameters interface
 */
export interface BackendParameters {
    host?: string;
    alias?: string;
    mapping?: {
        [x: string]: any;
    };
    middlewares?: Middleware[];
    config?: any;
    fixtures?: any;
    softDelete?: boolean;
    debug?: boolean;
}
