import { DataObjectClass } from './types/DataObjectClass'
import { DataObjectProperties } from '@quatrain/core'

/**
 * Internal abstract building block for all DataObjects and Domain Models.
 * Defines the static metadata contract (`COLLECTION`, `PARENT_PROP`, `LABEL_KEY`) 
 * and standard data accessors.
 */
export abstract class AbstractObject {
   /** The property schema array defining the shape of the object. */
   static PROPS_DEFINITION: DataObjectProperties = []

   /** The default registry alias for the backend handling this object type. */
   static DEFAULT_BACKEND: string = 'default'

   protected _dataObject: DataObjectClass<any>

   /** The explicit name to use in backend as table/collection identifer. */
   static COLLECTION: string | undefined

   /** The name of the property handling relation to the parent collection. */
   static PARENT_PROP: string | undefined

   /** The property's value to use in backend as a human-readable label for object reference. */
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

   /**
    * Assigns a raw value to a property. The property handles validation internally.
    * 
    * @param key - The property name.
    * @param val - The value to store.
    * @returns True if successful.
    */
   set(key: string, val: any) {
      return this._dataObject.set(key, val)
   }

   /**
    * Directly retrieves the unwrapped, raw value of a property.
    * 
    * @param key - The property name.
    * @returns The raw value.
    * @throws {Error} If the property doesn't exist.
    */
   val(key: string): any {
      const prop = this.get(key)
      if (prop) {
         return prop.val()
      } else {
         throw new Error(`${key} is not a valid property`)
      }
   }

   /**
    * Checks if a property exists in the definition schema.
    * 
    * @param key - The property name to verify.
    * @returns True if defined.
    */
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

   /**
    * Serializes the object down to a JSON-safe state, usually passing through to the URI's toJSON.
    * 
    * @returns The serialized data.
    */
   toJSON() {
      return typeof this.uri === 'string' ? this.uri : this.uri?.toJSON()
   }

   get backend() {
      return this._dataObject.backend
   }

   /**
    * Requests the underlying data object to persist itself.
    * 
    * @returns A promise resolving to this instance.
    */
   async save(): Promise<this> {
      await this._dataObject.save()
      return this
   }

   /**
    * Requests the underlying data object to delete itself from the backend.
    * 
    * @returns A promise resolving upon deletion.
    */
   async delete(): Promise<DataObjectClass<any>> {
      return await this._dataObject.delete()
   }
}
