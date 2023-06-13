import { DataObjectClass } from '../components/types/DataObjectClass'
import { BaseProperty, BasePropertyType } from './BaseProperty'
import { BooleanProperty } from './BooleanProperty'
import { DateTimeProperty } from './DateTimeProperty'
import { EnumProperty } from './EnumProperty'
import { HashProperty } from './HashProperty'
import { StringProperty } from './StringProperty'
import { NumberProperty } from './NumberProperty'
import { ObjectProperty } from './ObjectProperty'
import { CollectionProperty } from './CollectionProperty'
import { ArrayProperty } from './ArrayProperty'

export class Property {
   static TYPE_ANY = 'any'
   static TYPE_NUMBER = 'number'
   static TYPE_STRING = 'string'
   static TYPE_OBJECT = 'object'
   static TYPE_ENUM = 'enum'
   static TYPE_BOOLEAN = 'boolean'
   static TYPE_HASH = 'hash'
   static TYPE_DATETIME = 'datetime'
   static TYPE_ARRAY = 'array'

   static factory<P extends BasePropertyType>(
      params: P,
      parent: DataObjectClass<any>
   ) {
      params.parent = parent
      switch (params.type) {
         case BaseProperty.TYPE:
            return new BaseProperty(params)

         case StringProperty.TYPE:
            return new StringProperty(params)

         case NumberProperty.TYPE:
            return new NumberProperty(params)

         case ObjectProperty.TYPE:
            return new ObjectProperty(params)

         case EnumProperty.TYPE:
            return new EnumProperty(params)

         case BooleanProperty.TYPE:
            return new BooleanProperty(params)

         case HashProperty.TYPE:
            return new HashProperty(params)

         case DateTimeProperty.TYPE:
            return new DateTimeProperty(params)

         case CollectionProperty.TYPE:
            return new CollectionProperty(params)

         case ArrayProperty.TYPE:
            return new ArrayProperty(params)

         default:
            throw new Error(`Unknown property type ${params.type}`)
      }
   }
}
