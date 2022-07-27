import { Property, PropertyType } from './Property'

export interface BasePropertyType {
   name: string
   type?:
      | typeof Property.TYPE_STRING
      | typeof Property.TYPE_ENUM
      | typeof Property.TYPE_BOOLEAN
      | typeof Property.TYPE_OBJECT
   protected?: boolean
   mandatory?: boolean
   defaultValue?: any
}

export class BaseProperty implements PropertyType {
   protected _name: string
   protected _value: any = undefined
   protected _mandatory: boolean = false
   protected _protected: boolean = false
   protected _allows: String[] = []
   protected _defaultValue: any

   constructor(config: BasePropertyType) {
      this._name = config.name
      this._protected = config.protected || false
      this._mandatory = config.mandatory || false
      this._defaultValue = config.defaultValue
      this._value = config.defaultValue
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

   set(value: any) {
      if (
         this._value !== undefined &&
         this._value !== this._defaultValue &&
         this._protected === true
      ) {
         throw new Error(`Value already defined and protected from change`)
      }
      this._value = value

      return this
   }

   val(transform: any = undefined) {
      return this._value
   }

   protected _enable(value: boolean | undefined) {
      return value === undefined || value === true
   }
}
