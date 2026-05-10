import { QueueParameters } from './types/QueueParameters'

/**
 * Blueprint for Queue messaging adapters (AMQP, SQS, PubSub, etc.).
 */
export abstract class AbstractQueueAdapter {
   protected _params: QueueParameters
   protected _client: any

   constructor(params: QueueParameters) {
      this._params = params
   }

   /**
    * Dispatches a payload into a specified queue or topic.
    * 
    * @param data - The payload to send.
    * @param topic - The destination topic/queue name.
    * @returns The resolved message ID.
    */
   abstract send(data: any, topic: string): Promise<string>

   /**
    * Starts a background listener on a given queue topic.
    * 
    * @param topic - The queue name.
    * @param handler - The callback function.
    * @param params - Execution context options.
    */
   abstract listen(
      topic: string,
      handler: Function,
      params?: { concurrency?: number; gpu?: boolean }
   ): any
}
