import { AbstractObject } from '@quatrain/core';
/**
 * Generate data from model of object and save it in default backend
 * @param model
 * @param qty
 * @param forcedValues
 * @returns
 */
export declare const DataGenerator: <T extends AbstractObject>(model: T, qty?: number, forcedValues?: any) => Promise<any>;
