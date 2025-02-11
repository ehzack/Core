import { PropertyClassType } from '../../properties/types/PropertyClassType'
import { ObjectUri } from '../ObjectUri'
import { toJSONParams } from './toJSONParams'

export interface DataObjectClass<T extends DataObjectClass<any>> {
   uri: ObjectUri
   uid: any
   path: any
   class: any
   properties: any
   parentProp: string | undefined

   setProperties(properties: any): void
   getProperties(type: any): any
   addProperty(property: PropertyClassType): void
   populate(data?: any): Promise<T>
   isPopulated(): boolean
   has(key: string): boolean
   get(key: string): any
   set(key: string, val: any): any
   val(key: string): any
   clone(data?: any): Promise<T>
   toReference(): any
   toJSON(params?: boolean | toJSONParams): any
   populateFromData(data: { [x: string]: unknown }): this
   asProxy(): any
}
