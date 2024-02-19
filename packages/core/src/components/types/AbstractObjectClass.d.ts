import { DataObjectClass } from './DataObjectClass';
export interface AbstractObjectClass {
    dataObject: DataObjectClass<any>;
    asReference(): any;
    val(val: string): any;
}
