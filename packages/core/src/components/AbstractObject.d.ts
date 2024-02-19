import { DataObjectClass } from './types/DataObjectClass';
import { DataObjectProperties } from '../properties';
export declare abstract class AbstractObject {
    static PROPS_DEFINITION: DataObjectProperties;
    static COLLECTION: string | undefined;
    static LABEL_KEY: string;
    protected _dataObject: DataObjectClass<any>;
    constructor(dao: DataObjectClass<any>);
    /**
     * Return property object matching key
     * @param key string
     * @returns
     */
    get(key: string): any;
    set(key: string, val: any): any;
    val(key: string): any;
    get backend(): any;
    get path(): string;
    get uid(): any;
    get dataObject(): DataObjectClass<any>;
    get _(): any;
    get uri(): import("./ObjectUri").ObjectUri;
    toJSON(): {
        backend: string;
        ref: string;
        label: string;
    };
    save(): Promise<this>;
    delete(): Promise<DataObjectClass<any>>;
}
