import { BaseProperty, BasePropertyType } from './BaseProperty'

export interface ObjectPropertyType extends BasePropertyType {
   instanceOf?: Function
}

export class ObjectProperty extends BaseProperty {
   _instanceOf: Function

   constructor(config: ObjectPropertyType) {
      super(config)
      this._instanceOf = config.instanceOf || Object
   }

   set(value: Object | undefined) {
      if (value instanceof this._instanceOf) {
         return super.set(value)
      } else {
         throw new Error(
            `value is not an instance of ${this._instanceOf.constructor.name}`
         )
      }
   }
}
