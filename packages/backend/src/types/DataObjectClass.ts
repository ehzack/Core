import { DataObjectClass as DOC } from '@quatrain/core'

export interface DataObjectClass<T extends DataObjectClass<any>>
   extends DOC<any> {
   isPersisted(set: boolean): boolean
   read(): Promise<T>
   save(): Promise<T>
   delete(): Promise<T>
}
