import { DataObject } from '../components/DataObject'
import { ObjectUri } from '../components/ObjectUri'
import { BaseProperty, BasePropertyType } from './BaseProperty'
import { returnAs } from '../backends/Query'
import { BaseObjectClass } from '../components/types/BaseObjectClass'
import { Core } from '../Core'

export interface FilePropertyType extends BasePropertyType {
}

export class FileProperty extends BaseProperty {
   static TYPE = 'file'
   _value: BaseObjectClass | ObjectUri | undefined = undefined

   constructor(config: FilePropertyType) {
      super(config)
   }

   // val(transform: string | undefined = undefined) {
   //    if (typeof this._instanceOf === 'string') {
   //       this._instanceOf = Core.getClass(this._instanceOf)
   //    }

   //    if (!this._value) {
   //       return this._defaultValue
   //    }
   //    switch (transform) {
   //       case returnAs.AS_DATAOBJECTS:
   //          if (this._value instanceof DataObject) {
   //             console.log(`Returning already existing dataObject`)
   //             return this._value
   //          } else if (this._value instanceof ObjectUri) {
   //             console.log(`Converting objectUri -> dataObject`)
   //             return DataObject.factory({
   //                properties: Reflect.get(this._instanceOf, 'PROPS_DEFINITION'),
   //                uri: this._value,
   //             })
   //          } else {
   //             console.log(`Converting instance -> dataObject`)
   //             return this._value.dataObject
   //          }
   //       case returnAs.AS_INSTANCES:
   //          if (this._value instanceof DataObject) {
   //             console.log(`Converting dataObject -> instance`)
   //             return Reflect.construct(this._instanceOf, [this._value])
   //          } else if (this._value instanceof ObjectUri) {
   //             // console.log('ObjectProperty', this)

   //             console.log(`Converting objectUri -> dataObject -> instance`)
   //             // console.log(this._instanceOf)
   //             const dao = DataObject.factory({
   //                properties: Reflect.get(this._instanceOf, 'PROPS_DEFINITION'),
   //                uri: this._value,
   //             })
   //             return Reflect.construct(this._instanceOf, [dao])
   //          } else {
   //             console.log(`Returning already existing instance`)
   //             return this._value
   //          }
   //       case returnAs.AS_OBJECTURIS:
   //       default:
   //          return this._value
   //    }
   // }

   // set(value: object, setChanged = true) {
   //    if (
   //       value! instanceof ObjectUri &&
   //       value! instanceof DataObject &&
   //       value.constructor.name !== this._instanceOf.constructor.name
   //    ) {
   //       throw new Error(
   //          `value ${JSON.stringify(value)} is not an instance of ${
   //             this._instanceOf.constructor.name
   //          }`
   //       )
   //    }

   //    return super.set(value, setChanged)
   // }

   // toJSON() {
   //    if (this._value instanceof ObjectUri) {
   //       return this._value.toJSON()
   //    }

   //    return this._value &&
   //       (this._value.dataObject || this._value instanceof DataObject)
   //       ? this._value.dataObject.toReference()
   //       : null
   // }
}
