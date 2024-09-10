import { QueueParameters } from './types/QueueParameters'

export class AbstractQueueAdapter {
   protected _params: QueueParameters
   protected _client: any

   constructor(params: QueueParameters) {
      this._params = params
   }
}
