import { Core } from '@quatrain/core';
import Middleware from './middlewares/Middleware';
import { AbstractBackendAdapter } from './AbstractBackendAdapter';
export declare enum BackendAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
    WRITE = "write"
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
    hierarchy?: {
        [collection: string]: any;
    };
    mapping?: {
        [x: string]: any;
    };
    middlewares?: Middleware[];
    config?: any;
    fixtures?: any;
    softDelete?: boolean;
    useNativeForeignKeys?: boolean;
    debug?: boolean;
}
export type BackendRegistry<T extends AbstractBackendAdapter> = {
    [x: string]: T;
};
export declare class Backend extends Core {
    static defaultBackend: string;
    protected static _backends: BackendRegistry<any>;
    static addBackend(backend: AbstractBackendAdapter, alias: string, setDefault?: boolean): void;
    static getBackend<T extends AbstractBackendAdapter>(alias?: string): T;
    static log(message: any, src?: string): void;
}