import { BaseObjectType } from './BaseObjectType'

export default interface Payload<T extends BaseObjectType> {
   items: T[]
   meta: Meta
}

export interface Meta {
   count: number
   updatedAt: number
}
