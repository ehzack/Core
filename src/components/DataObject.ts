import { Core } from '../'
import { Property } from '../properties'
import { ObjectUri } from './ObjectUri'

export interface DataObjectFactoryType {
   path: string
   [x: string]: any
}

/**
 * Data objects constitute the agnostic glue between objects and backends.
 * They handle data and identifiers in a protected registry
 * This is what backends and objects manipulate, oblivious of the other.
 */
export class DataObject {
   protected _class: Function
   protected _objectUri: ObjectUri | undefined
   protected _obj: any
   protected _uid: string | undefined = undefined
   protected _data: { [x: string]: any } = {}
   protected _persisted: boolean = false
   protected _populated: boolean = false

   protected constructor(objClass: Function, data: any[] | undefined) {
      this._class = objClass
      if (Array.isArray(data)) {
         data.forEach(prop => (this._data[prop.name] = Property.factory(prop)))
      }
   }

   /**
    * Populate data object from instant data or backend query
    * @param data
    */
   async populate(data: any = undefined): Promise<DataObject> {
      if (this._populated === false) {
         if (data) {
            console.log(`[DAO] Populating ${this.path}`)
            for (const key in data) {
               console.log(`processing ${key}`)
               if (Reflect.get(this._data, key)) {
                  Reflect.get(this._data, key).set(data[key])
               }
            }
         } else if (this.path !== '/') {
            await Core.getBackend(this.backend).read(this)
         }
         this._populated = true
      }

      return this
   }

   isPopulated() {
      return this._populated
   }

   isPersisted() {
      return this._persisted
   }

   get backend() {
      return this._objectUri ? this._objectUri.backend : undefined
   }

   get class() {
      return this._class
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
      return this._data
   }

   set uri(uri: string | ObjectUri | undefined) {
      this._objectUri = uri instanceof ObjectUri ? uri : new ObjectUri(uri)
   }

   get uri() {
      return this._objectUri
   }

   get(key: string) {
      return this._data[key]
   }

   set(key: string, val: any) {
      if (!Reflect.has(this._data, key)) {
         throw new Error(`Unknown property in data object: ${key}`)
      }
      this._data[key] = val
      this._populated = true

      return this
   }

   val(key: string) {
      if (Reflect.get(this._data, key)) {
         return Reflect.get(this._data, key).val()
      } else {
         console.log(key, this._data)
         throw new Error(`Unknown property '${key}'`)
      }
   }

   toJSON() {
      return {
         uid: this._uid,
         //path: this._path,
         ...this._dataToJSON(),
      }
   }

   protected _dataToJSON() {
      const data = {}
      Object.keys(this._data).forEach((key: string) => {
         const prop: any = Reflect.get(this._data, key)
         if (typeof prop === 'object' && Reflect.has(prop, 'toJSON')) {
            Reflect.set(data, key, prop.toJSON())
         } else if (prop !== undefined) {
            Reflect.set(data, key, prop)
         }
      })

      return data
   }

   async read(): Promise<DataObject> {
      try {
         return this.populate(Core.getBackend().read(this))
      } catch (err) {
         console.log((err as Error).message)
         throw new Error((err as Error).message)
      }
   }

   async save(desiredUid: string | undefined = undefined): Promise<DataObject> {
      const backend = Core.getBackend(this.backend || Core.defaultBackend)
      this._persisted = true
      return this._uid
         ? await backend.update(this)
         : await backend.create(this, desiredUid)
   }

   /**
    * Data object must be created from factory in order for async-loaded data to be available
    * @param className
    * @param param
    * @returns DataObject
    */
   static async factory(
      className: any,
      param: any[] | undefined = undefined
   ): Promise<DataObject> {
      if (className === undefined) {
         throw new Error(`className is a require value`)
      }

      try {
         return new this(className, param)
      } catch (err) {
         console.log(err)
         throw new Error(
            `Unable to build data object: ${(err as Error).message}`
         )
      }
   }
}
