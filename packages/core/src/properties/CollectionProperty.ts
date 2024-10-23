import { BaseProperty, BasePropertyType } from './BaseProperty'
import { ObjectUri } from '../components/ObjectUri'
import { Core } from '../Core'
import { DataObjectClass } from '../components/types/DataObjectClass'
import { BaseObject } from '../components/BaseObject'

export interface CollectionPropertyType extends BasePropertyType {
   instanceOf: typeof BaseObject
   backend?: any
   parentKey?: string
}

export class CollectionProperty extends BaseProperty {
   static TYPE = 'collection'
   protected _value:
      | Array<any>
      | Array<DataObjectClass<any>>
      | Array<ObjectUri>
      | undefined = undefined
   protected _instanceOf: typeof BaseObject
   protected _parentKey: string

   constructor(config: CollectionPropertyType) {
      super(config)
      if (!config.instanceOf) {
         throw new Error(`Parameter 'instanceOf' is mandatory`)
      }
      this._instanceOf =
         typeof config.instanceOf === 'string'
            ? Core.classRegistry[config.instanceOf]
            : config.instanceOf
      this._parentKey =
         config.parentKey || this._parent?.uri?.collection || 'unknown'
   }

   set(value: Array<any>, setChanged = true) {
      return super.set(value, setChanged)
   }

   toJSON() {
      return this._value
   }
}
