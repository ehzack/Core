import { DataObject as CoreDO, DataObjectClass, ObjectUri } from '@quatrain/core'
import { BaseObjectCore } from './BaseObjectCore'
import { Backend } from './Backend'

/**
 * Data objects constitute the agnostic glue between objects and backends.
 * They handle data and identifiers in a protected registry
 * This is what backends and objects manipulate, oblivious of the other.
 */
export class DataObject extends CoreDO {

   protected _proxied: any

   /**
    * Constructor is protected, use factory() instead
    * @param params object of parameters
    */


   /**
    * Populate data object from instant data or backend query
    * @param data
    */
   async populate(
      data: { name: string; [x: string]: unknown } | undefined = undefined
   ): Promise<DataObject> {
      if (this._populated === false) {
         if (data) {
            this.populateFromData(data)
         } else if (this.path !== '/' && this.path !== '') {
            await this.populateFromBackend()
         }
         this._populated = true

         if (Reflect.get(this._properties, 'name')) {
            this.uri.label = this.val('name')
         }
      }

      return this
   }

   /**
    * Populate data object from backend query
    * @param data
    */
   async populateFromBackend(): Promise<DataObject> {
      if (this._populated === false) {
         if (this.path !== '/' && this.path !== '') {
            await Backend.getBackend(this._objectUri.backend).read(this)
         }
         this._populated = true

         if (Reflect.get(this._properties, 'name')) {
            this.uri.label = this.val('name')
         }
      }

      return this
   }

   get backend() {
      return this._objectUri ? this._objectUri.backend : undefined
   }

   protected _dataToJSON(
      objectsAsReferences = false,
      ignoreUnchanged = false,
      converters = {}
   ) {
      const data = {}
      Object.keys(this._properties).forEach((key: string) => {
         const prop = Reflect.get(this._properties, key)
         if (ignoreUnchanged && prop.hasChanged === false) return

         //   console.log(prop.constructor.name);
         switch (prop.constructor.name) {
            case 'CollectionProperty':
               // ignore
               break
            case 'ObjectProperty':
               const value: BaseObjectCore | ObjectUri | undefined = prop.val()
               Reflect.set(
                  data,
                  key,
                  value
                     ? objectsAsReferences && !(value instanceof ObjectUri)
                        ? value.asReference()
                        : value.toJSON
                        ? value.toJSON()
                        : value
                     : null
               )

               break

            case 'BooleanProperty':
               Reflect.set(data, key, Boolean(prop.val()))
               break

            case 'ArrayProperty':
               Reflect.set(data, key, prop.val() || [])
               break

            case 'DateTimeProperty':
               Reflect.set(
                  data,
                  key,
                  prop.val(Reflect.get(converters, 'datetime')) || null
               )
               break

            default:
               Reflect.set(data, key, prop.val() || null)
               break
         }
      })

      return data
   }

   async read(): Promise<DataObjectClass<any>> {
      try {
         return await Backend.getBackend().read(this) //this.populate()
      } catch (err) {
         console.log((err as Error).message)
         throw new Error((err as Error).message)
      }
   }

   save(): Promise<DataObjectClass<any>> {
      const backend = Backend.getBackend(this.backend || Backend.defaultBackend)
      this._persisted = true
      this._modified = false

      return this.uid ? backend.update(this) : backend.create(this)
   }

   async delete(): Promise<DataObjectClass<any>> {
      const backend = Backend.getBackend(this.backend || Backend.defaultBackend)
      this._persisted = false
      this._modified = false

      return await backend.delete(this)
   }
}
