import { DataObjectClass } from './types/DataObjectClass'
import { DataObjectProperties } from '@quatrain/core'

export abstract class AbstractObject {
   static PROPS_DEFINITION: DataObjectProperties = []

   static DEFAULT_BACKEND: string = 'default'

   protected _dataObject: DataObjectClass<any>

   // Which name to use in backend as table/collection identifer
   static COLLECTION: string | undefined

   // which property handles relation to parent
   static PARENT_PROP: string | undefined

   // Which property's value to use in backend as label for object reference
   static LABEL_KEY = 'name'

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
      const prop = this.get(key)
      if (prop) {
         return prop.val()
      } else {
         throw new Error(`${key} is not a valid property`)
      }
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

   get backend() {
      return this._dataObject.backend
   }

   async save(): Promise<this> {
      await this._dataObject.save()
      return this
   }

   async delete(): Promise<DataObjectClass<any>> {
      return await this._dataObject.delete()
   }
}
