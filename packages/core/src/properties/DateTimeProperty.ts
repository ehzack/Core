import { BaseProperty, BasePropertyType } from './BaseProperty'

export interface DateTimePropertyType extends BasePropertyType {
   timezone?: string
}

export class DateTimeProperty extends BaseProperty {
   static AS_IS = 'asis'
   static UNIX_TIMESTAMP = 'unix_timestamp'

   static TYPE = 'datetime'

   static RETURN_AS: string = DateTimeProperty.AS_IS

   protected _timezone: string

   constructor(config: DateTimePropertyType) {
      super(config)
      this._timezone = config.timezone || 'Z'
   }

   set(value: string | Date | number, setChanged = true) {
      if (value && DateTimeProperty.RETURN_AS === 'unix_timestamp') {
         if (typeof value === 'string') {
            value = Date.parse(value)
         } else if (typeof value === 'object') {
            value = (value as Date).getTime()
         }
      }
      return super.set(value, setChanged)
   }

   get timezone() {
      return this._timezone
   }
}
