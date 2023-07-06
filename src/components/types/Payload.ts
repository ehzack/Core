import { BaseObject } from '../BaseObject'
import { Persisted } from './Persisted'

export default interface Payload<T extends BaseObject> {
   items: Persisted<T>[]
   meta: Meta
}

export interface Meta {
   count: number
   updatedAt: number
}
