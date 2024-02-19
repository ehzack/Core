import { BaseObject } from '../components/BaseObject';
import { Proxy } from '../components/types/ProxyConstructor';
/**
 * Generate data from model of object and save it in default backend
 * @param model
 * @param qty
 * @param forcedValues
 * @returns
 */
export declare const DataGenerator: <T extends BaseObject>(model: Proxy<T>, qty?: number, forcedValues?: any) => Promise<any>;
