import { DataObject } from './DataObject'
import { DataObjectProperties } from '../properties/'

export abstract class AbstractObject {
   static PROPS_DEFINITION: DataObjectProperties = []

   // Which name to use in backend as table or collection identifer
   static COLLECTION: string = this.constructor.name.toLowerCase()

   // Which property's value to use in backend as label for object reference
   static LABEL_KEY = 'name'

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
      const prop = this.get(key)
      if (prop) {
         return prop.val()
      } else {
         throw new Error(`${key} is not a valid property`)
      }
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

   get uri() {
      return this._dataObject.uri
   }

   toJSON() {
      return typeof this.uri === 'string' ? this.uri : this.uri?.toJSON()
   }

   async save(uid: string | undefined = undefined) {
      return await this._dataObject.save(uid)
   }
}
