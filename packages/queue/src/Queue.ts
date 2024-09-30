import { Core } from '@quatrain/core'
import { AbstractQueueAdapter } from './AbstractQueueAdapter'

/**
 * Queue Parameters acceptable keys
 */
export type QueueParametersKeys =
   | 'host'
   | 'alias'
   | 'middlewares'
   | 'config'
   | 'debug'

export type QueueRegistry<T extends AbstractQueueAdapter> = { [x: string]: T }

export class Queue extends Core {
   static defaultQueue = '@default'

   protected static _queues: QueueRegistry<any> = {}

   static addQueue(
      queue: AbstractQueueAdapter,
      alias: string,
      setDefault: boolean = false
   ) {
      this._queues[alias] = queue
      if (setDefault) {
         this.defaultQueue = alias
      }
   }

   static getQueue<T extends AbstractQueueAdapter>(
      alias: string = this.defaultQueue
   ): T {
      if (this._queues[alias]) {
         return this._queues[alias]
      } else {
         throw new Error(`Unknown queue alias: '${alias}'`)
      }
   }

   static log(message: any, src = 'Message Queue') {
      super.log(message, src)
   }
}
