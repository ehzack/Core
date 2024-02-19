import { BaseProperty, BasePropertyType } from './BaseProperty';
export interface BooleanPropertyType extends BasePropertyType {
}
export declare class BooleanProperty extends BaseProperty {
    static TYPE: string;
    set(value: boolean): this;
}
