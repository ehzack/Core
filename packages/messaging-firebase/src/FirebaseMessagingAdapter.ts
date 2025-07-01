import {
   AbstractMessagingAdapter,
   Messaging,
   MessagingParameters,
   MessagingRecipient,
   NotificationCapableAdapter,
   NotificationMessage,
} from '@quatrain/messaging'
import { credential } from 'firebase-admin'
import { getApps, initializeApp, ServiceAccount } from 'firebase-admin/app'
import { getMessaging, Message } from 'firebase-admin/messaging'

export class FirebaseMessagingAdapter
   extends AbstractMessagingAdapter
   implements NotificationCapableAdapter
{
   protected _messaging: any

   constructor(params: MessagingParameters = {}) {
      super(params)
      this._initializeFirebase()
   }

   protected _initializeFirebase() {
      try {
         if (getApps().length === 0) {
            if (!this._params.config) {
               throw new Error('Firebase config is required')
            }
            const serviceAccount: ServiceAccount = this._params.config
            initializeApp({
               credential: credential.cert(serviceAccount),
               databaseURL: this._params.config.databaseURL,
            })
         }
         this._messaging = getMessaging()
      } catch (error) {
         Messaging.error(
            `Failed to initialize Firebase: ${(error as Error).message}`
         )
         throw error
      }
   }

   /**
    * Sends a notification to a single recipient via Firebase Cloud Messaging
    *
    * @param recipient - The message recipient containing contact info and FCM token
    * @param message - The notification message with title, body, and optional data
    * @returns Promise<string> - The Firebase message ID on successful delivery
    * @throws Error if recipient has no message token or Firebase send fails
    */
   async sendNotification(
      recipient: MessagingRecipient,
      message: NotificationMessage
   ): Promise<string> {
      try {
         if (!recipient.messageToken) {
            throw new Error('Recipient message token is required')
         }

         const firebaseMessage: Message = {
            token: message.token || recipient.messageToken,
            notification: {
               title: message.title,
               body: message.body || '',
            },
            data: this._serializeData(message.data || {}),
         }

         const response = await this._messaging.send(firebaseMessage)

         Messaging.info(
            `Notification sent successfully to ${recipient.firstname} ${recipient.lastname}: ${response}`
         )

         return response
      } catch (error) {
         const errorMessage = `Failed to send notification to ${
            recipient.firstname
         } ${recipient.lastname}: ${(error as Error).message}`
         Messaging.error(errorMessage)
         throw new Error(errorMessage)
      }
   }

   async sendNotifications(
      recipients: MessagingRecipient[],
      message: NotificationMessage
   ): Promise<{
      successCount: number
      failureCount: number
      responses: any[]
   }> {
      try {
         const tokens = recipients
            .map((recipient) => recipient.messageToken)
            .filter((token) => token) as string[]

         if (tokens.length === 0) {
            throw new Error('No valid message tokens found')
         }

         const multicastMessage = {
            tokens,
            notification: {
               title: message.title,
               body: message.body || '',
            },
            data: this._serializeData(message.data || {}),
         }

         const response = await this._messaging.sendMulticast(multicastMessage)

         Messaging.info(
            `Multicast notification sent: ${response.successCount} successful, ${response.failureCount} failed`
         )

         return response
      } catch (error) {
         const errorMessage = `Failed to send multicast notification: ${
            (error as Error).message
         }`
         Messaging.error(errorMessage)
         throw new Error(errorMessage)
      }
   }

   private _serializeData(data: any): Record<string, string> {
      const serialized: Record<string, string> = {}

      for (const [key, value] of Object.entries(data)) {
         if (typeof value === 'string') {
            serialized[key] = value
         } else {
            serialized[key] = JSON.stringify(value)
         }
      }

      return serialized
   }
}
