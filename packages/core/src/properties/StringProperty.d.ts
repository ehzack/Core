import { BaseProperty, BasePropertyType } from './BaseProperty';
export interface StringPropertyType extends BasePropertyType {
    minLength: number;
    maxLength?: number;
    allowSpaces?: boolean;
    allowDigits?: boolean;
    allowLetters?: boolean;
    allowPattern?: String;
    fullSearch?: boolean;
}
export declare class StringProperty extends BaseProperty {
    static TYPE: string;
    static TRANSFORM_UCASE: string;
    static TRANSFORM_LCASE: string;
    static ALLOW_SPACES: string;
    static ALLOW_LETTERS: string;
    static ALLOW_DIGITS: string;
    static ALLOW_STRINGS: string;
    static ALLOW_NUMBERS: string;
    protected _minLength: number;
    protected _maxLength: number;
    protected _fullSearch: boolean;
    protected _value: string | undefined;
    /**
     * Set to false to bypass some rules
     */
    protected _rawValue: boolean;
    constructor(config: StringPropertyType);
    set(value: any): this;
    get(transform?: string | undefined): string | undefined;
    set minLength(min: number);
    get minLength(): number;
    set maxLength(max: number);
    get maxLength(): number;
    set fullSearch(mode: boolean);
    get fullSearch(): boolean;
}
