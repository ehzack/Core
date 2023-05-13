import { DataObjectClass } from './DataObjectClass'

export interface BaseObjectClass {
   status: string
   dataObject: DataObjectClass<any>
   asReference(): any
}
