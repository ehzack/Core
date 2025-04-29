import { Mode } from 'fs'
import { ModeEnum } from './ModeEnum'
import { AbstractQueueAdapter } from '@quatrain/queue'

export interface HandlerParameters {
   mode: string | typeof ModeEnum
   topic?: string
   queueAdapter?: AbstractQueueAdapter
}
