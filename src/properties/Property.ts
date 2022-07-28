import { DataObject } from '..'
import { BasePropertyType } from './BaseProperty'
import { BooleanProperty } from './BooleanProperty'
import { EnumProperty } from './EnumProperty'
import { ObjectProperty } from './ObjectProperty'
import { StringProperty } from './StringProperty'

export interface PropertyType {
   set(value: any): void
   val(transform: any): void
}

export class Property {
   static TYPE_STRING = 'string'
   static TYPE_OBJECT = 'object'
   static TYPE_NUMBER = 'number'
   static TYPE_ENUM = 'enum'
   static TYPE_BOOLEAN = 'boolean'

   static EVENT_ONCHANGE = 'onChange'
   static EVENT_ONDELETE = 'onDelete'

   static ALLOW_SPACES = 'spaces'
   static ALLOW_LETTERS = 'letters'
   static ALLOW_DIGITS = 'digits'

   static factory<P extends BasePropertyType>(params: P, parent: DataObject) {
      params.parent = parent
      switch (params.type) {
         case Property.TYPE_STRING:
            return new StringProperty(params)

         case Property.TYPE_OBJECT:
            return new ObjectProperty(params)

         case Property.TYPE_ENUM:
            return new EnumProperty(params)

         case Property.TYPE_BOOLEAN:
            return new BooleanProperty(params)

         default:
            throw new Error(`Unknown property type ${params.type}`)
      }
   }
}
