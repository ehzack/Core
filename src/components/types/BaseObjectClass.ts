import { DataObjectClass } from './DataObjectClass'

export interface BaseObjectClass {
   dataObject: DataObjectClass<any>
   asReference(): any
}

export interface BaseObjectMethods {
   toJSON: () => any
   save: () => Promise<void>
}
