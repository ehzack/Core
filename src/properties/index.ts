import { Property } from './Property'
import { BaseProperty, BasePropertyType } from './BaseProperty'
import { StringProperty, StringPropertyType } from './StringProperty'
import { EnumProperty, EnumPropertyType } from './EnumProperty'
import { BooleanProperty, BooleanPropertyType } from './BooleanProperty'
import { ObjectProperty, ObjectPropertyType } from './ObjectProperty'

export {
   Property,
   BaseProperty,
   BasePropertyType,
   BooleanProperty,
   BooleanPropertyType,
   EnumProperty,
   EnumPropertyType,
   ObjectProperty,
   ObjectPropertyType,
   StringProperty,
   StringPropertyType,
}

export type DataObjectProperties = (
   | BooleanPropertyType
   | EnumPropertyType
   | ObjectPropertyType
   | StringPropertyType
)[]
