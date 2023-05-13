import { DataObjectClass } from './DataObjectClass'

export interface AbstractObjectClass {
   status: string
   dataObject: DataObjectClass<any>
   asReference(): any
}
