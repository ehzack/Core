import { AbstractAuthAdapter } from './authentication';
import { AbstractAdapter } from './backends/AbstractAdapter';
import { User } from './components/User';
import { DataObjectClass } from './components/types/DataObjectClass';
export type BackendRegistry<T extends AbstractAdapter> = {
    [x: string]: T;
};
export declare class Core {
    static defaultBackend: string;
    static userClass: typeof User;
    static classRegistry: {
        [key: string]: any;
    };
    static logger: Console;
    static auth: AbstractAuthAdapter;
    static timestamp: () => string;
    protected static _backends: BackendRegistry<any>;
    static definition(key: string): {
        manifest: {
            type: StringConstructor;
            mandatory: boolean;
        };
    };
    static addBackend(backend: AbstractAdapter, alias: string, setDefault?: boolean): void;
    static getBackend<T extends AbstractAdapter>(alias?: string): T;
    static addClass(name: string, obj: any): void;
    static getClass(name: string): any;
    /**
     * Returns the class to use for a data object
     * This is currently just a stub that will be implemented from config in the future
     * @returns DataObjectClass
     */
    static getDataObjectClass(): DataObjectClass<any>;
    /**
     * Log message using defined logger
     * This is currently just a stub that will be implemented from config in the future
     * @param message string | object
     * @param level string
     */
    static log(message: any, src?: string, level?: string): void;
}
