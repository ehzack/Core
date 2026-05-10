import { MessagingParameters } from './Messaging'

/**
 * Base class contract enforcing setup logic across all messaging capabilities 
 * (Email, SMS, Push Notifications).
 */
export abstract class AbstractMessagingAdapter {
   protected _params: MessagingParameters = {}

   constructor(params: MessagingParameters = {}) {
      this._params = params
   }
}
