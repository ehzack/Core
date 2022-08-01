import { BaseProperty, BasePropertyType } from './'

export interface BooleanPropertyType extends BasePropertyType {}

export class BooleanProperty extends BaseProperty {
   set(value: boolean) {
      return super.set(value)
   }
}
