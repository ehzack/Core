import { ModeEnum } from './ModeEnum'
import { AbstractQueueAdapter } from '@quatrain/queue'

export interface HandlerParameters {
   mode: string | typeof ModeEnum
   topic?: string
   concurrency?: number
   queueAdapter?: AbstractQueueAdapter
   gpu?: boolean
}
