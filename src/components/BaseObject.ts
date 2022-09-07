import { DataObject } from './DataObject'
import { ObjectUri } from './ObjectUri'
import { AbstractObject } from './AbstractObject'
import { BaseObjectProperties } from './BaseObjectProperties'
import { DataObjectProperties } from '../properties'

export class BaseObject extends AbstractObject {
   static PROPS_DEFINITION: DataObjectProperties = BaseObjectProperties

   get status(): string {
      return this._dataObject.get('status')
   }

   set status(status: string) {
      this._dataObject.set('status', status)
   }

   static async factory(
      src: string | ObjectUri | object | undefined = undefined
   ) {
      try {
         // merge base properties with additional or redefined ones
         const base = BaseObjectProperties

         this.PROPS_DEFINITION &&
            this.PROPS_DEFINITION.forEach((property) => {
               const found = base.findIndex((el) => el.name === property.name)
               if (found !== -1) {
                  base[found] = Object.assign(base[found], property)
               } else {
                  base.push(property)
               }
            })

         // create data object
         const dao = await DataObject.factory(this.prototype, base)

         if (src instanceof ObjectUri) {
            dao.uri = src
            await dao.populate()
         } else if (src instanceof Object) {
            await dao.populate(src)
         }
         return new this(dao)
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
}
