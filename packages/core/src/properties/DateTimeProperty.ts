import { BaseProperty, BasePropertyType } from './BaseProperty'

export interface DateTimePropertyType extends BasePropertyType {
   timezone?: string
}

export class DateTimeProperty extends BaseProperty {
   static TYPE = 'datetime'
   protected _timezone: string

   constructor(config: DateTimePropertyType) {
      super(config)
      this._timezone = config.timezone || 'Z'
   }

   set(value: string | Date, setChanged = true) {
      return super.set(value, setChanged)
   }

   get timezone() {
      return this._timezone
   }
}
