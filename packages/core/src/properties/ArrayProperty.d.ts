import { BaseProperty, BasePropertyType } from './BaseProperty';
export interface ArrayPropertyType extends BasePropertyType {
    minLength?: number;
    maxLength?: number;
    allowNumbers?: boolean;
    allowStrings?: boolean;
}
export declare class ArrayProperty extends BaseProperty {
    static TYPE: string;
    protected _value: Array<any> | undefined;
    protected _minLength: number;
    protected _maxLength: number;
    constructor(config: ArrayPropertyType);
    set minLength(min: number);
    get minLength(): number;
    set maxLength(max: number);
    get maxLength(): number;
    set(value: Array<any>): this;
    get(transform?: Function | undefined): any;
    toJSON(): any[] | undefined;
}
