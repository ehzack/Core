import { QueueParameters } from './types/QueueParameters'

export abstract class AbstractQueueAdapter {
   protected _params: QueueParameters
   protected _client: any

   constructor(params: QueueParameters) {
      this._params = params
   }

   abstract send(data: any, topic: string): Promise<string>

   abstract listen(topic: string): any
}
