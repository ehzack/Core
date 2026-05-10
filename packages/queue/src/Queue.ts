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

/**
 * Singleton Registry dispatching abstract asynchronous tasks.
 */
export class Queue extends Core {
   /** Reference ID for the primary default queue. */
   static defaultQueue = '@default'
   /** Domain specific Core Logger. */
   static logger = this.addLogger('Queue')

   protected static _queues: QueueRegistry<any> = {}

   /**
    * Appends a new instantiated queue handler logic block into the system map.
    * 
    * @param queue - The underlying provider adapter.
    * @param alias - The lookup name.
    * @param setDefault - True to switch standard queue router.
    */
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

   /**
    * Look up and returns a bound active adapter by its name.
    * 
    * @param alias - Provider mapping string.
    * @returns Instantiated provider.
    * @throws When binding is missing.
    */
   static getQueue<T extends AbstractQueueAdapter>(
      alias: string = this.defaultQueue
   ): T {
      if (this._queues[alias]) {
         return this._queues[alias]
      } else {
         throw new Error(`Unknown queue alias: '${alias}'`)
      }
   }
}
