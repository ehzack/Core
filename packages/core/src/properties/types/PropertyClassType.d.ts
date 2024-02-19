import { AbstractPropertyType } from './AbstractPropertyType';
export interface PropertyClassType {
    name: string;
    set(value: any): AbstractPropertyType;
    val(transform?: any): any;
    toJSON(): any;
    clone(): PropertyClassType;
}
