import { ObjectUri } from '../components/ObjectUri'
import { BaseProperty, BasePropertyType } from './BaseProperty'
import { BaseObjectClass } from '../components/types/BaseObjectClass'

export interface FilePropertyType extends BasePropertyType {}

export class FileProperty extends BaseProperty {
   static TYPE = 'file'
   _value: BaseObjectClass | ObjectUri | undefined = undefined

   constructor(config: FilePropertyType) {
      super(config)
   }
}
