import { MessagingParameters } from './Messaging'

export abstract class AbstractMessagingAdapter {
   protected _params: MessagingParameters = {}

   constructor(params: MessagingParameters = {}) {
      this._params = params
   }
}
