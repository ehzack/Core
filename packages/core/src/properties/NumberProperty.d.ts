import { BaseProperty, BasePropertyType } from './BaseProperty';
export type NumberSign = typeof NumberProperty.TYPE_SIGNED | typeof NumberProperty.TYPE_UNSIGNED;
export type NumberType = typeof NumberProperty.TYPE_INTEGER | typeof NumberProperty.TYPE_FLOAT;
export interface NumberPropertyType extends BasePropertyType {
    minVal?: number;
    maxVal?: number;
    sign?: NumberSign;
    type?: NumberType;
    prefix?: string;
    suffix?: string;
    precision?: number;
}
export declare class NumberProperty extends BaseProperty {
    static TYPE: string;
    static TYPE_SIGNED: string;
    static TYPE_UNSIGNED: string;
    static TYPE_INTEGER: string;
    static TYPE_FLOAT: string;
    static SEPARATOR: string;
    static TRANSFORM_FORMATTED: string;
    protected _minVal: number | undefined;
    protected _maxVal: number | undefined;
    protected _type: NumberType;
    protected _sign: NumberSign;
    protected _prefix: string;
    protected _suffix: string;
    protected _precision: number;
    protected _value: number | undefined;
    constructor(config: NumberPropertyType);
    set(value: number): this;
    val(transform?: string | undefined): string | number | undefined;
    set minVal(min: number | undefined);
    get minVal(): number | undefined;
    set maxVal(max: number | undefined);
    get maxVal(): number | undefined;
    get type(): string;
}
