import { Property } from './Property'
import { BaseProperty, BasePropertyType } from './BaseProperty'
import { StringProperty, StringPropertyType } from './StringProperty'
import { HashProperty, HashPropertyType } from './HashProperty'
import { EnumProperty, EnumPropertyType } from './EnumProperty'
import { BooleanProperty, BooleanPropertyType } from './BooleanProperty'
import { DateTimeProperty, DateTimePropertyType } from './DateTimeProperty'
import { ObjectProperty, ObjectPropertyType } from './ObjectProperty'

export {
   Property,
   BaseProperty,
   BasePropertyType,
   BooleanProperty,
   BooleanPropertyType,
   DateTimeProperty,
   DateTimePropertyType,
   EnumProperty,
   EnumPropertyType,
   ObjectProperty,
   ObjectPropertyType,
   StringProperty,
   StringPropertyType,
   HashProperty,
   HashPropertyType,
}

export type PropertyTypes =
   | typeof Property.TYPE_STRING
   | typeof Property.TYPE_ENUM
   | typeof Property.TYPE_BOOLEAN
   | typeof Property.TYPE_OBJECT
   | typeof Property.TYPE_DATETIME
   | typeof Property.TYPE_HASH

type BaseType = { type: PropertyTypes }

export type DataObjectProperties = (
   | (BooleanPropertyType & BaseType)
   | (EnumPropertyType & BaseType)
   | (ObjectPropertyType & BaseType)
   | (StringPropertyType & BaseType)
   | (HashPropertyType & BaseType)
   | (DateTimeProperty & BaseType)
)[]

export interface PropertyClassType {
   set(value: any): void
   val(transform: any): void
}
export interface AbstractPropertyType {
   name: string
   type?: PropertyTypes
}
