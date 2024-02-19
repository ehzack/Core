import { BaseProperty, BasePropertyType } from './BaseProperty';
export interface MapPropertyType extends BasePropertyType {
}
export declare class MapProperty extends BaseProperty {
    static TYPE: string;
    set(value: any): this;
    toJSON(): {};
}
