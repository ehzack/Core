import { ObjectUri } from '../components/ObjectUri';
import { BaseProperty, BasePropertyType } from './BaseProperty';
import { BaseObjectClass } from '../components/types/BaseObjectClass';
export interface ObjectPropertyType extends BasePropertyType {
    instanceOf: any;
}
export declare class ObjectProperty extends BaseProperty {
    static TYPE: string;
    _value: BaseObjectClass | ObjectUri | undefined;
    _instanceOf: any;
    constructor(config: ObjectPropertyType);
    val(transform?: string | undefined): any;
    set(value: object): this;
    toJSON(): any;
}
