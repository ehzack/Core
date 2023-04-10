import { DataObject } from './DataObject'
import { ObjectUri } from './ObjectUri'
import { AbstractObject } from './AbstractObject'
import { BaseObjectProperties } from './BaseObjectProperties'
import { DataObjectProperties } from '../properties'
import { Query } from '../backends'

export class BaseObject extends AbstractObject {
   static PROPS_DEFINITION: DataObjectProperties = BaseObjectProperties

   static getProperty(key: string) {
      return BaseObject.PROPS_DEFINITION.find((prop) => prop.name === key)
   }

   get status(): string {
      return this._dataObject.val('status')
   }

   set status(status: string) {
      this._dataObject.set('status', status)
   }

   static async factory<T extends BaseObject>(
      src: string | ObjectUri | DataObject | undefined = undefined,
      child: any
   ): Promise<T | BaseObject> {
      try {
         // merge base properties with additional or redefined ones
         const base = BaseObjectProperties

         // this.PROPS_DEFINITION &&
         this.PROPS_DEFINITION.forEach((property) => {
            // manage parent properties potential redeclaration
            const found = base.findIndex((el) => el.name === property.name)
            if (found !== -1) {
               base[found] = Object.assign(base[found], property)
            } else {
               base.push(property)
            }
         })

         // create data object
         const dao = await DataObject.factory(base)
         dao.uri.class = child

         if (src instanceof ObjectUri) {
            dao.uri = src
            await dao.populate()
         } else if (typeof src === 'string') {
            dao.uri.path = src
            await dao.populate()
         } else if (src instanceof Object) {
            dao.uri = new ObjectUri(
               `${this.COLLECTION}${ObjectUri.DEFAULT}`,
               Reflect.get(src, 'name')
            )
            dao.uri.collection = this.COLLECTION
            await dao.populate(src)
         }
         return Reflect.construct(child, [dao])
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
      return new Query(this)
   }
}
