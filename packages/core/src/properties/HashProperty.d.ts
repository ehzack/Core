import { StringProperty, StringPropertyType } from './StringProperty';
export type HashPropertyAlgos = typeof HashProperty.ALGORITHM_MD5 | typeof HashProperty.ALGORITHM_SHA1 | typeof HashProperty.ALGORITHM_SHA256;
export interface HashPropertyType extends StringPropertyType {
    algorithm?: HashPropertyAlgos;
    salt?: string;
    prefixed?: boolean;
}
export declare class HashProperty extends StringProperty {
    static TYPE: string;
    static ALGORITHM_MD5: string;
    static ALGORITHM_SHA1: string;
    static ALGORITHM_SHA256: string;
    static ALGORITHM_BCRYPT: string;
    protected _algorithm: HashPropertyAlgos;
    protected _salt: string;
    protected _prefixed: boolean;
    constructor(config: HashPropertyType);
    _hash(value: string): string;
    /**
     * Never return the password which is hashed anyway
     * @param transform
     * @returns
     */
    get(transform?: string | undefined): string | undefined;
    set(value: string): this;
    compare(value: string): boolean;
}
