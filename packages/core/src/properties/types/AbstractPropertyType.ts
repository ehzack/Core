import { PropertyTypes } from './PropertyTypes'

export interface AbstractPropertyType {
   name: string
   id?: string
   type?: PropertyTypes
   defaultValue?: any
}
