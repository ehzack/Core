import { BaseProperty, BasePropertyType } from './BaseProperty';
export interface EnumPropertyType extends BasePropertyType {
    values?: string[];
}
export declare class EnumProperty extends BaseProperty {
    static TYPE: string;
    protected _values: string[];
    constructor(config: EnumPropertyType);
    set(value: string): this;
    get values(): string[];
}
