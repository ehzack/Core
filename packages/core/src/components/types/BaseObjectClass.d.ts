import { AbstractObjectClass } from './AbstractObjectClass';
import { DataObjectClass } from './DataObjectClass';
export interface BaseObjectClass extends AbstractObjectClass {
    dataObject: DataObjectClass<any>;
    asReference(): any;
    save(): Promise<this>;
}
