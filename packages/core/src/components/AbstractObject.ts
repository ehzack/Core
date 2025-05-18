import { DataObjectClass } from './types/DataObjectClass'
import { DataObjectProperties } from '../properties'

export abstract class AbstractObject {
   static PROPS_DEFINITION: DataObjectProperties = []

   // Which name to use in backend as table/collection identifer
   static COLLECTION: string | undefined

   // which property handles relation to parent
   static PARENT_PROP: string | undefined

   // Which property's value to use in backend as label for object reference
   static LABEL_KEY = 'name'

   protected _dataObject: DataObjectClass<any>

   constructor(dao: DataObjectClass<any>) {
      this._dataObject = dao
   }

   /**
    * Return property object matching key
    * @param key string
    * @returns
    */
   get(key: string) {
      return this._dataObject.get(key)
   }

   set(key: string, val: any) {
      return this._dataObject.set(key, val)
   }

   val(key: string): any {
      if (!this.has(key)) return null

      const prop = this.get(key)
      if (prop) {
         return prop.val()
      } else {
         return null
      }
   }

   has(key: string) {
      return Reflect.has(this._dataObject.properties, key)
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

   get _() {
      return this._dataObject.asProxy()
   }

   get uri() {
      return this._dataObject.uri
   }

   toJSON() {
      return typeof this.uri === 'string' ? this.uri : this.uri?.toJSON()
   }
}
