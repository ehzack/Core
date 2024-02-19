import { DataObjectClass } from '../components/types/DataObjectClass';
import { AbstractPropertyType } from './types/AbstractPropertyType';
import { PropertyClassType } from './types/PropertyClassType';
import { PropertyHTMLType } from './types/PropertyHTMLType';
export type EventTypes = typeof BaseProperty.EVENT_ONCHANGE | typeof BaseProperty.EVENT_ONDELETE;
export interface BasePropertyType extends AbstractPropertyType {
    parent?: DataObjectClass<any>;
    protected?: boolean;
    mandatory?: boolean;
    defaultValue?: any;
    htmlType?: PropertyHTMLType;
    onChange?: (dao: DataObjectClass<any>) => DataObjectClass<any>;
}
export declare class BaseProperty implements PropertyClassType {
    static TYPE: string;
    static EVENT_ONCHANGE: string;
    static EVENT_ONDELETE: string;
    protected _parent: DataObjectClass<any> | undefined;
    protected _name: string;
    protected _value: any;
    protected _mandatory: boolean;
    protected _protected: boolean;
    protected _allows: String[];
    protected _htmlType: PropertyHTMLType;
    protected _defaultValue: any;
    protected _events: {
        [key: EventTypes]: Function;
    };
    constructor(config: BasePropertyType);
    get name(): string;
    get mandatory(): boolean;
    get protected(): boolean;
    get allows(): String[];
    set htmlType(type: PropertyHTMLType);
    get htmlType(): PropertyHTMLType;
    set(value: any): this;
    val(transform?: any): any;
    protected _enable(value: boolean | undefined): boolean;
    toJSON(): any;
    clone(): any;
}
