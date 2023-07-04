import { ObjectUri } from './ObjectUri'
import { DataObjectClass } from './types/DataObjectClass'
import { BaseObjectClass } from './types/BaseObjectClass'
import { AbstractObject } from './AbstractObject'
import { BaseObjectProperties, BaseObject } from './BaseObjectProperties'
import { Query } from '../backends/Query'
import { DataObject } from './DataObject'
import { Persisted } from './types/Persisted'
import { ProxyConstructor } from './types/ProxyConstructor'

export class BaseObjectCore extends AbstractObject implements BaseObjectClass {
   static PROPS_DEFINITION: any = BaseObjectProperties

   static getProperty(key: string) {
      return BaseObjectCore.PROPS_DEFINITION.find(
         (prop: any) => prop.name === key
      )
   }

   private static fillProperties() {
      const base = BaseObjectProperties

      this.PROPS_DEFINITION.forEach((property: any) => {
         // manage parent properties potential redeclaration
         const found = base.findIndex((el: any) => el.name === property.name)
         if (found !== -1) {
            base[found] = Object.assign(base[found], property)
         } else {
            base.push(property)
         }
      })

      return DataObject.factory({
         properties: base,
      })
   }

   static fromObject<T extends BaseObject>(
      src: Omit<T, 'core' | 'toJSON'>,
      child?: any
   ): T {
      const dao = this.fillProperties()

      dao.uri.class = child
      dao.uri.collection = this.COLLECTION

      dao.uri = new ObjectUri(
         `${this.COLLECTION}${ObjectUri.DEFAULT}`,
         Reflect.get(src, 'name')
      )

      dao.uri.class = child

      dao.populateFromData(src as any)

      const obj = new this(dao)

      return obj.toProxy() as T
   }

   static async daoFactory(
      src:
         | string
         | ObjectUri
         | { name: string; [x: string]: unknown }
         | undefined = undefined,
      child: any = this
   ): Promise<DataObjectClass<any>> {
      // merge base properties with additional or redefined ones
      const dao = this.fillProperties()

      dao.uri.class = child

      if (src instanceof ObjectUri) {
         dao.uri = src
         await dao.read()
      } else if (typeof src === 'string') {
         dao.uri.path = src
         await dao.read()
      }

      if (!dao.uri.collection) {
         dao.uri.collection = this.COLLECTION
      }

      return dao
   }

   static async factory(
      src:
         | string
         | ObjectUri
         | { name: string; [x: string]: unknown }
         | undefined = undefined,
      child: any = this
   ): Promise<any> {
      try {
         if (src instanceof Object) {
            return this.fromObject(src)
         }

         const dao = await this.daoFactory(src, child)

         const constructedObject = Reflect.construct(this, [dao])

         return constructedObject.toProxy()
      } catch (err) {
         throw new Error(
            `Unable to build instance for '${this.constructor.name}': ${
               (err as Error).message
            }`
         )
      }
   }

   static async fromBackend<T>(path: string): Promise<Persisted<T>> {
      return this.factory(path)
   }

   static fromDataObject<T extends BaseObject>(dao: DataObjectClass<any>): T {
      const obj = new this(dao)

      return obj.toProxy()
   }

   private toProxy<ProxyType extends BaseObject>() {
      return new ProxyConstructor<this, ProxyType>(this, {
         get: (cible, prop) => {
            if (prop === 'uid') {
               return cible.uid
            }

            if (prop === 'uri') {
               return cible.uri
            }

            if (prop == 'toJSON') {
               return cible.toJSON
            }

            if (prop === 'core') {
               return cible
            }

            // i don't know why and i shouldn't have to wonder why
            // but everything crashes unless we do this terribleness
            if (prop == 'then') {
               return
            }

            return cible.val(prop as string)
         },
         set(cible, prop, newValue, _receiver) {
            if (prop === 'uid' || prop === 'core') {
               throw new Error(`Property '${prop}' is readonly`)
            }

            cible.set(prop as string, newValue)
            return true
         },
      })
   }

   asReference() {
      return this._dataObject.toReference()
   }

   query() {
      return new Query(this.constructor.prototype)
   }

   static query() {
      return new Query(this)
   }
}
