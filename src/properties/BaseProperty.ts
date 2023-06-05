import { DataObjectClass } from '../components/types/DataObjectClass'
import { AbstractPropertyType } from './types/AbstractPropertyType'
import { PropertyClassType } from './types/PropertyClassType'
import { PropertyHTMLType } from './types/PropertyHTMLType'

export type EventTypes =
   | typeof BaseProperty.EVENT_ONCHANGE
   | typeof BaseProperty.EVENT_ONDELETE

export interface BasePropertyType extends AbstractPropertyType {
   parent?: DataObjectClass<any>
   protected?: boolean
   mandatory?: boolean
   defaultValue?: any
   htmlType?: PropertyHTMLType
   onChange?: (dao: DataObjectClass<any>) => DataObjectClass<any>
}

export class BaseProperty implements PropertyClassType {
   static TYPE = 'any'
   static EVENT_ONCHANGE = 'onChange'
   static EVENT_ONDELETE = 'onDelete'

   protected _parent: DataObjectClass<any> | undefined
   protected _name: string
   protected _value: any = undefined
   protected _mandatory: boolean = false
   protected _protected: boolean = false
   protected _allows: String[] = []
   protected _htmlType: PropertyHTMLType = 'off'
   protected _defaultValue: any
   protected _events: { [key: EventTypes]: Function } = {}

   constructor(config: BasePropertyType) {
      this._parent = config.parent
      this._name = config.name
      this._protected = config.protected || false
      this._mandatory = config.mandatory || false
      this._defaultValue = config.defaultValue
      this._value = config.defaultValue
      this._htmlType = config.htmlType || 'off'
      if (typeof config.onChange === 'function') {
         this._events.onChange = config.onChange
      }
   }

   get name() {
      return this._name
   }

   get mandatory() {
      return this._mandatory
   }

   get protected() {
      return this._protected
   }

   get allows() {
      return this._allows
   }

   set htmlType(type: PropertyHTMLType) {
      this._htmlType = type
   }

   get htmlType() {
      return this._htmlType
   }

   set(value: any) {
      if (
         this._value !== undefined &&
         this._value !== null &&
         this._value !== this._defaultValue &&
         this._protected === true
      ) {
         throw new Error(
            `Value '${this._name}' already defined as '${this._value}' and protected from change`
         )
      }
      this._value = value

      if (this._events[BaseProperty.EVENT_ONCHANGE]) {
         this._events[BaseProperty.EVENT_ONCHANGE](this._parent)
      }

      return this
   }

   val(transform: any = undefined): any {
      return transform ? transform(this._value) : this._value
   }

   protected _enable(value: boolean | undefined) {
      return value === undefined || value === true
   }

   toJSON() {
      return this._value
   }
}
