import { BaseProperty, BasePropertyType } from './BaseProperty';
export interface DateTimePropertyType extends BasePropertyType {
    timezone?: string;
}
export declare class DateTimeProperty extends BaseProperty {
    static TYPE: string;
    protected _timezone: string;
    constructor(config: DateTimePropertyType);
    set(value: string | Date): this;
    get timezone(): string;
}
