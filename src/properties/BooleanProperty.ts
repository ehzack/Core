import { BaseProperty, BasePropertyType } from './BaseProperty'

export interface BooleanPropertyType extends BasePropertyType {}

export class BooleanProperty extends BaseProperty {
   set(value: boolean) {
      return super.set(value)
   }
}
