import { ObjectUri } from './ObjectUri'
import { DataObjectClass } from './types/DataObjectClass'
import { BaseObjectClass } from './types/BaseObjectClass'
import { AbstractObject } from './AbstractObject'
import { BaseObjectProperties } from './BaseObjectProperties'
import { Query } from '../backends/Query'
import { DataObject } from './DataObject'

export class BaseObject extends AbstractObject implements BaseObjectClass {
   static PROPS_DEFINITION: any = BaseObjectProperties

   static getProperty(key: string) {
      return BaseObject.PROPS_DEFINITION.find((prop: any) => prop.name === key)
   }

   get status(): string {
      return this._dataObject.val('status')
   }

   set status(status: string) {
      this._dataObject.set('status', status)
   }

   static async daoFactory(
      src: string | ObjectUri | DataObjectClass<any> | undefined = undefined,
      child: any = this
   ): Promise<DataObjectClass<any>> {
      // merge base properties with additional or redefined ones
      const base = [...BaseObject.PROPS_DEFINITION]

      // this.PROPS_DEFINITION &&
      child.PROPS_DEFINITION.forEach((property: any) => {
         // manage parent properties potential redeclaration
         const found = base.findIndex((el: any) => el.name === property.name)
         if (found !== -1) {
            base[found] = property
         } else {
            base.push(property)
         }
      })

      // create data object
      const dao = await DataObject.factory({ properties: base })
      dao.uri.class = child

      if (src instanceof ObjectUri) {
         dao.uri = src
         await dao.read()
      } else if (typeof src === 'string') {
         dao.uri.path = src
         await dao.read()
      } else if (src instanceof Object) {
         dao.uri = new ObjectUri(
            `${this.COLLECTION}${ObjectUri.DEFAULT}`,
            Reflect.get(src, 'name')
         )
         dao.uri.collection = this.COLLECTION
         await dao.populate(src)
      }

      return dao
   }

   static async factory<T extends BaseObject>(
      src: string | ObjectUri | DataObjectClass<any> | undefined = undefined,
      child: any = this
   ): Promise<T | BaseObject> {
      try {
         const dao = await this.daoFactory(src, child)

         return Reflect.construct(this, [dao])
      } catch (err) {
         console.log((err as Error).message)
         throw new Error(
            `Unable to build instance for '${this.constructor.name}': ${
               (err as Error).message
            }`
         )
      }
   }

   asReference() {
      return this._dataObject.toReference()
   }

   query() {
      return new Query(this.constructor.prototype)
   }
}
