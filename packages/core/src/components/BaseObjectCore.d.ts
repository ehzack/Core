import { ObjectUri } from './ObjectUri';
import { DataObjectClass } from './types/DataObjectClass';
import { BaseObjectClass } from './types/BaseObjectClass';
import { AbstractObject } from './AbstractObject';
import { BaseObject } from './BaseObject';
import { Query } from '../backends/Query';
import { DataObject } from './DataObject';
import { Persisted } from './types/Persisted';
import { Proxy } from './types/ProxyConstructor';
import { DataObjectProperties } from '../properties';
export declare class BaseObjectCore extends AbstractObject implements BaseObjectClass {
    static PROPS_DEFINITION: DataObjectProperties;
    static getProperty(key: string): (import("../properties").NumberPropertyType & {
        type: string;
    }) | (import("../properties").BooleanPropertyType & {
        type: string;
    }) | (import("../properties").EnumPropertyType & {
        type: string;
    }) | (import("../properties").ObjectPropertyType & {
        type: string;
    }) | (import("../properties").StringPropertyType & {
        type: string;
    }) | (import("../properties").HashPropertyType & {
        type: string;
    }) | (import("../properties").DateTimeProperty & {
        type: string;
    }) | (import("../properties").ArrayPropertyType & {
        type: string;
    }) | (import("../properties").MapPropertyType & {
        type: string;
    }) | (import("../properties").CollectionPropertyType & {
        type: string;
    }) | undefined;
    static fillProperties(child?: any): DataObject;
    static daoFactory(src?: string | ObjectUri | DataObjectClass<any> | undefined, child?: any): Promise<DataObjectClass<any>>;
    /**
     * Instantiates from an object
     * @param src
     * @param child
     * @returns
     */
    static fromObject<T extends BaseObject>(src: T, child?: any): any;
    static factory(src?: string | ObjectUri | BaseObject | undefined, child?: any): Promise<any>;
    /**
     * Fetches an object from its backend path
     * @param path
     * @returns
     */
    static fromBackend<T>(path: string): Promise<Persisted<T>>;
    /**
     * Instantiates from a DataObject
     * @param dao
     * @returns
     */
    static fromDataObject<T extends BaseObject>(dao: DataObjectClass<any>): any;
    /**
     * Wrap instance into proxy to get access to properties
     * @returns Proxy
     */
    protected toProxy<T extends BaseObject>(): Proxy<Proxy<T>>;
    asReference(): any;
    query(): Query<any>;
    static query(): Query<typeof BaseObjectCore>;
}
