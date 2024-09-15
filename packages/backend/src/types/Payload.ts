import { BaseObject } from '@quatrain/core'

export default interface Payload<T extends BaseObject> {
   items: T[]
   meta: Meta
}

export interface Meta {
   count: number
   updatedAt: number
}
