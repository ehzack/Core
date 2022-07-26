import { BaseProperty, BasePropertyType } from './BaseProperty'

export interface EnumPropertyType extends BasePropertyType {
   values?: string[]
}

export class EnumProperty extends BaseProperty {
   protected _values: string[] = []

   constructor(config: EnumPropertyType) {
      super(config)
      this._values = config.values || []
   }

   set(value: string) {
      if (!this._values.includes(value)) {
         throw new Error(`Value '${value}' is not acceptable`)
      }

      return super.set(value)
   }
}
