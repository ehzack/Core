import { DataObjectProperties } from '../properties';
import { PropertyClassType } from '../properties/types/PropertyClassType';
import { AbstractObject } from './AbstractObject';
import { ObjectUri } from './ObjectUri';
import { DataObjectClass } from './types/DataObjectClass';
export type CoreObject<T extends AbstractObject> = T;
export type Properties = {
    [x: string]: PropertyClassType;
};
export interface DataObjectFactoryType {
    path: string;
    [x: string]: any;
}
export interface DataObjectParams {
    uri?: string | ObjectUri;
    properties: DataObjectProperties;
}
/**
 * Data objects constitute the agnostic glue between objects and backends.
 * They handle data and identifiers in a protected registry
 * This is what backends and objects manipulate, oblivious of the other.
 */
export declare class DataObject implements DataObjectClass<any> {
    protected _objectUri: ObjectUri;
    protected _uid: string | undefined;
    protected _properties: Properties;
    protected _persisted: boolean;
    protected _populated: boolean;
    protected _proxied: any;
    /**
     * Has data been modified since last backend operation?
     */
    protected _modified: boolean;
    /**
     * Constructor is protected, use factory() instead
     * @param params object of parameters
     */
    protected constructor(params: DataObjectParams | undefined);
    protected _init(properties: any[]): void;
    /**
     * Wrap instance into proxy to get access to properties
     * @returns Proxy
     */
    asProxy(): this;
    setProperties(properties: Properties): void;
    addProperty(property: PropertyClassType): void;
    /**
     * Populate data object from instant data or backend query
     * @param data
     */
    populate(data?: {
        name: string;
        [x: string]: unknown;
    } | undefined): Promise<DataObject>;
    /**
     * Populate data object from instant data or backend query
     * @param data
     */
    populateFromData(data: {
        [x: string]: unknown;
    }): this;
    /**
     * Populate data object from backend query
     * @param data
     */
    populateFromBackend(): Promise<DataObject>;
    isPopulated(): boolean;
    isPersisted(): boolean;
    get properties(): Properties;
    get backend(): string | undefined;
    get path(): string;
    set uid(uid: string | undefined);
    get uid(): string | undefined;
    get data(): any;
    set uri(uri: ObjectUri);
    get uri(): ObjectUri;
    get class(): any;
    has(key: string): boolean;
    /**
     * Returns property matching key or throw
     * @param key string
     * @returns BaseProperty
     */
    get(key: string): PropertyClassType;
    set(key: string, val: any): this;
    /**
     * Get value of given property
     * @param key string
     * @returns any
     */
    val(key: string, transform?: string | undefined): any;
    toJSON(objectsAsReferences?: boolean): {
        [x: string]: any;
    };
    toReference(): {
        label: any;
        ref: string;
        uri: string;
    };
    protected _dataToJSON(objectsAsReferences?: boolean): {};
    read(): Promise<DataObjectClass<any>>;
    save(): Promise<DataObjectClass<any>>;
    delete(): Promise<DataObjectClass<any>>;
    /**
     * Data object must be created from factory in order for async-loaded data to be available
     * @param className
     * @param param
     * @returns DataObject
     */
    static factory(param?: DataObjectParams | undefined): DataObject;
    clone(data?: any): Promise<DataObject>;
}
