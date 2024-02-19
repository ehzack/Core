import { DataObjectClass } from '../components/types/DataObjectClass';
import { BaseProperty } from './BaseProperty';
import { BooleanPropertyType } from './BooleanProperty';
import { DateTimePropertyType } from './DateTimeProperty';
import { EnumPropertyType } from './EnumProperty';
import { HashPropertyType } from './HashProperty';
import { StringPropertyType } from './StringProperty';
import { NumberPropertyType } from './NumberProperty';
import { ObjectPropertyType } from './ObjectProperty';
export declare class Property {
    static TYPE_ANY: string;
    static TYPE_NUMBER: string;
    static TYPE_STRING: string;
    static TYPE_OBJECT: string;
    static TYPE_ENUM: string;
    static TYPE_BOOLEAN: string;
    static TYPE_HASH: string;
    static TYPE_DATETIME: string;
    static TYPE_ARRAY: string;
    static TYPE_MAP: string;
    static factory(params: ObjectPropertyType & StringPropertyType & NumberPropertyType & EnumPropertyType & BooleanPropertyType & HashPropertyType & DateTimePropertyType, parent: DataObjectClass<any>): BaseProperty;
}
