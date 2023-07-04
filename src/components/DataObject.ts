import { Core } from '../Core'
import { DataObjectProperties } from '../properties'
import { Property } from '../properties/Property'
import { PropertyClassType } from '../properties/types/PropertyClassType'
import { AbstractObject } from './AbstractObject'
import { ObjectUri } from './ObjectUri'
import { DataObjectClass } from './types/DataObjectClass'

export type CoreObject<T extends AbstractObject> = T
export type Properties = { [x: string]: PropertyClassType }

export interface DataObjectFactoryType {
   path: string
   [x: string]: any
}

export interface DataObjectParams {
   uri?: string | ObjectUri
   properties: DataObjectProperties
}

/**
 * Data objects constitute the agnostic glue between objects and backends.
 * They handle data and identifiers in a protected registry
 * This is what backends and objects manipulate, oblivious of the other.
 */
export class DataObject implements DataObjectClass<any> {
   protected _objectUri: ObjectUri
   protected _uid: string | undefined = undefined
   protected _properties: Properties = {}
   protected _persisted: boolean = false
   protected _populated: boolean = false

   /**
    * Has data been modified since last backend operation?
    */
   protected _modified: boolean = false

   /**
    * Constructor is protected, use factory() instead
    * @param params object of parameters
    */
   protected constructor(params: DataObjectParams | undefined) {
      if (params) {
         if (typeof params.uri !== 'object') {
            this._objectUri = new ObjectUri(params.uri)
         } else {
            this._objectUri = params.uri
         }
      } else {
         this._objectUri = new ObjectUri()
      }

      if (params && Array.isArray(params.properties)) {
         this._init(params.properties)
      }
   }

   protected _init(properties: any[]) {
      properties.forEach((prop) => {
         this._properties[prop.name] = Property.factory(prop, this)
      })
   }

   public setProperties(properties: Properties) {
      // TODO check if doable
      this._properties = properties
   }

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
    * Populate data object from instant data or backend query
    * @param data
    */
   populateFromData(data: { [x: string]: unknown }): DataObject {
      if (this._populated === false) {
         for (const key in data) {
            if (Reflect.get(this._properties, key)) {
               Reflect.get(this._properties, key).set(data[key])
            }
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
            await Core.getBackend(this._objectUri.backend).read(this)
         }
         this._populated = true

         if (Reflect.get(this._properties, 'name')) {
            this.uri.label = this.val('name')
         }
      }

      return this
   }

   isPopulated() {
      return this._populated
   }

   isPersisted() {
      return this._persisted
   }

   get properties() {
      return this._properties
   }

   get backend() {
      return this._objectUri ? this._objectUri.backend : undefined
   }

   get path() {
      return this._objectUri ? this._objectUri.path : ''
   }

   set uid(uid: string | undefined) {
      if (this._uid !== undefined) {
         throw new Error(`DataObject already has an uid`)
      }
      this._uid = uid
   }

   get uid(): string | undefined {
      return this._objectUri ? this._objectUri.uid : undefined
   }

   get data(): any {
      return this._properties
   }

   set uri(uri: string | ObjectUri | undefined) {
      this._objectUri = uri instanceof ObjectUri ? uri : new ObjectUri(uri)
      if (this._objectUri.collection !== ObjectUri.MISSING_COLLECTION) {
         this._persisted = true
      }
   }

   get uri(): ObjectUri {
      return this._objectUri
   }

   get class(): any {
      // TODO get class type
      return this.uri.class
   }

   has(key: string) {
      return Reflect.has(this._properties, key)
   }

   /**
    * Returns property matching key or throw
    * @param key string
    * @returns BaseProperty
    */
   get(key: string) {
      try {
         return this._properties[key]
      } catch (err) {
         throw new Error((err as Error).message)
      }
   }

   set(key: string, val: any) {
      if (!this.has(key)) {
         throw new Error(`Unknown property in data object: ${key}`)
      }
      this._properties[key].set(val)
      this._populated = true
      this._modified = true

      return this
   }

   /**
    * Get value of given property
    * @param key string
    * @returns any
    */
   val(key: string) {
      if (this.has(key)) {
         return Reflect.get(this._properties, key).val()
      } else {
         throw new Error(`Unknown property '${key}'`)
      }
   }

   toJSON(): { [x: string]: any } {
      return {
         ...(this._uid && { uid: this._uid }),
         ...this._dataToJSON(),
      }
   }

   toReference() {
      return {
         ...this._objectUri.toReference(),
         label: this.val('name') || '',
      }
   }

   protected _dataToJSON() {
      const data = {}
      Object.keys(this._properties).forEach((key: string) => {
         const prop = Reflect.get(this._properties, key)

         const value = prop.val()

         switch (prop.constructor.name) {
            case 'ObjectProperty':
               Reflect.set(data, key, typeof value ? prop.toJSON() : null)
               break

            default:
               Reflect.set(data, key, value || null)
         }
      })

      return data
   }

   async read(): Promise<DataObjectClass<any>> {
      try {
         return await Core.getBackend().read(this) //this.populate()
      } catch (err) {
         console.log((err as Error).message)
         throw new Error((err as Error).message)
      }
   }

   async save(): Promise<DataObjectClass<any>> {
      const backend = Core.getBackend(this.backend || Core.defaultBackend)
      this._persisted = true
      this._modified = false

      return this.uid ? backend.update(this) : backend.create(this)
   }

   async delete(): Promise<DataObjectClass<any>> {
      const backend = Core.getBackend(this.backend || Core.defaultBackend)
      this._persisted = false
      this._modified = false

      return await backend.delete(this)
   }

   /**
    * Data object must be created from factory in order for async-loaded data to be available
    * @param className
    * @param param
    * @returns DataObject
    */
   static factory(param: DataObjectParams | undefined = undefined): DataObject {
      try {
         return new this(param)
      } catch (err) {
         console.log(err)
         throw new Error(
            `Unable to build data object: ${(err as Error).message}`
         )
      }
   }

   async clone(data: any = {}): Promise<DataObject> {
      const cloned = await DataObject.factory()
      cloned.uri.class = this.uri.class
      cloned._populated = false

      for (let property of Object.keys(this._properties)) {
         cloned._properties[property] = this._properties[property].clone()
      }

      if (data) {
         await cloned.populate(data)
      }

      return cloned
   }
}
