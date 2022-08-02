import { DataObject } from '../components/DataObject'
import { ObjectUri } from '../components/ObjectUri'
import { BaseProperty, BasePropertyType } from './BaseProperty'

export interface ObjectPropertyType extends BasePropertyType {
   instanceOf?: Function | string | Object
}

export class ObjectProperty extends BaseProperty {
   _instanceOf: Function | string | Object

   constructor(config: ObjectPropertyType) {
      super(config)
      this._instanceOf = config.instanceOf || Object
   }

   set(value: DataObject | ObjectUri | Object) {
      if (
         value instanceof ObjectUri ||
         value instanceof DataObject ||
         value.constructor.name === this._instanceOf.constructor.name
      ) {
         return super.set(value)
      } else {
         throw new Error(
            `value ${JSON.stringify(value)} is not an instance of ${
               this._instanceOf.constructor.name
            }`
         )
      }
   }
}
