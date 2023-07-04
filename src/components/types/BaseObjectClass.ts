import { DataObjectClass } from './DataObjectClass'

export interface BaseObjectClass {
   dataObject: DataObjectClass<any>
   asReference(): any
}
