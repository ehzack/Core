import { StringProperty } from '../properties/StringProperty'
import * as htmlType from '../properties/types/PropertyHTMLType'

export const EntityProperties: any = [
   {
      // surcharge property minLength and htmlType
      name: 'name',
      type: StringProperty.TYPE,
      mandatory: true,
      minLength: 1,
      htmlType: htmlType.ORG,
   },
]
