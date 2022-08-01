import { DataObject } from './DataObject'
import { DataObjectProperties } from '../properties/'

export abstract class AbstractObject {
   static PROPS_DEFINITION: DataObjectProperties = []

   protected _dataObject: DataObject

   constructor(dao: DataObject) {
      this._dataObject = dao
   }

   get(key: string) {
      return this._dataObject.get(key)
   }

   set(key: string, val: any) {
      return this._dataObject.set(key, val)
   }

   val(key: string) {
      return this.get(key).val()
   }

   get backend() {
      return this._dataObject.backend
   }

   get path(): string {
      return this._dataObject.path
   }

   get uid() {
      return this._dataObject.uid
   }

   get dataObject() {
      return this._dataObject
   }

   async save(uid: string | undefined = undefined) {
      return await this._dataObject.save(uid)
   }
}
