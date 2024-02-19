export declare class ObjectUri {
    static DEFAULT: string;
    static MISSING_COLLECTION: string;
    protected _str: string;
    protected _pairs: Array<string>;
    protected _literal: string;
    protected _backend: string;
    protected _path: string;
    protected _uid: string | undefined;
    protected _collection: string | undefined;
    protected _label: string | undefined;
    protected _objClass: any;
    /**
     * create object uri from string:
     * ex: 'xyz', '@backend:xyz', 'collection/xyz', '@backend:collection/xyz'
     * some backends will need a collection or table name, some may deduct it from object
     * @param str
     */
    constructor(str?: string, label?: string | undefined);
    set class(objClass: any);
    get class(): any;
    get backend(): string;
    get path(): string;
    set label(label: string | undefined);
    get label(): string | undefined;
    get literal(): string;
    set path(path: string);
    get uid(): string | undefined;
    get collection(): string | undefined;
    set collection(collection: string | undefined);
    /**
     * Return references to find object locally and remotely
     * @returns object
     */
    toReference(): {
        ref: string;
        uri: string;
        label: string | undefined;
    };
    toJSON(): {
        backend: string;
        ref: string;
        label: string;
    };
}
