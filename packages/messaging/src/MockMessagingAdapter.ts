import { AbstractMessagingAdapter } from './AbstractMessagingAdapter'
import { NotificationCapableAdapter } from './types/NotificationCapableAdapter'
import { EmailCapableAdapter } from './types/EmailCapableAdapter'
import { TextCapableAdapter } from './types/TextCapableAdapter'
import { MessagingRecipient } from './types/MessagingRecipient'
import { NotificationMessage } from './types/NotificationMessage'
import { MessagingParameters } from './Messaging'

interface SentMessage {
   type: 'notification' | 'email' | 'text'
   recipient: MessagingRecipient | MessagingRecipient[]
   message: NotificationMessage
   timestamp: number
}

/**
 * Mock Messaging Adapter for testing purposes
 * Implements all three capability interfaces
 */
export class MockMessagingAdapter
   extends AbstractMessagingAdapter
   implements
      NotificationCapableAdapter,
      EmailCapableAdapter,
      TextCapableAdapter
{
   private sentMessages: SentMessage[] = []

   constructor(params: MessagingParameters = {}) {
      super(params)
   }

   /**
    * Mock tracking of a single notification dispatch.
    * 
    * @param recipient - Target info.
    * @param message - Payload.
    * @returns Mock response object.
    */
   async sendNotification(
      recipient: MessagingRecipient,
      message: NotificationMessage
   ): Promise<any> {
      this.sentMessages.push({
         type: 'notification',
         recipient,
         message,
         timestamp: Date.now(),
      })

      return {
         success: true,
         messageId: `notif-${Date.now()}`,
         recipient: recipient.email,
      }
   }

   /**
    * Mock tracking of a batch notification dispatch.
    * 
    * @param recipients - Array of targets.
    * @param message - Payload.
    * @returns Mock batch response object.
    */
   async sendNotifications(
      recipients: MessagingRecipient[],
      message: NotificationMessage
   ): Promise<any> {
      this.sentMessages.push({
         type: 'notification',
         recipient: recipients,
         message,
         timestamp: Date.now(),
      })

      return {
         success: true,
         count: recipients.length,
         messageIds: recipients.map((r, i) => `notif-batch-${Date.now()}-${i}`),
      }
   }

   /**
    * Mock tracking of a single email dispatch.
    * 
    * @param recipient - Target info.
    * @param message - Payload.
    * @returns Mock response object.
    */
   async sendEmail(
      recipient: MessagingRecipient,
      message: NotificationMessage
   ): Promise<any> {
      this.sentMessages.push({
         type: 'email',
         recipient,
         message,
         timestamp: Date.now(),
      })

      return {
         success: true,
         messageId: `email-${Date.now()}`,
         recipient: recipient.email,
      }
   }

   /**
    * Mock tracking of a batch email dispatch.
    * 
    * @param recipients - Array of targets.
    * @param message - Payload.
    * @returns Mock batch response object.
    */
   async sendEmails(
      recipients: MessagingRecipient[],
      message: NotificationMessage
   ): Promise<any> {
      this.sentMessages.push({
         type: 'email',
         recipient: recipients,
         message,
         timestamp: Date.now(),
      })

      return {
         success: true,
         count: recipients.length,
         messageIds: recipients.map((r, i) => `email-batch-${Date.now()}-${i}`),
      }
   }

   /**
    * Mock tracking of a single SMS dispatch.
    * 
    * @param recipient - Target info.
    * @param message - Payload.
    * @returns Mock response object.
    */
   async sendTextMessage(
      recipient: MessagingRecipient,
      message: NotificationMessage
   ): Promise<any> {
      this.sentMessages.push({
         type: 'text',
         recipient,
         message,
         timestamp: Date.now(),
      })

      return {
         success: true,
         messageId: `text-${Date.now()}`,
         recipient: recipient.email,
      }
   }

   /**
    * Mock tracking of a batch SMS dispatch.
    * 
    * @param recipients - Array of targets.
    * @param message - Payload.
    * @returns Mock batch response object.
    */
   async sendTextMessages(
      recipients: MessagingRecipient[],
      message: NotificationMessage
   ): Promise<any> {
      this.sentMessages.push({
         type: 'text',
         recipient: recipients,
         message,
         timestamp: Date.now(),
      })

      return {
         success: true,
         count: recipients.length,
         messageIds: recipients.map((r, i) => `text-batch-${Date.now()}-${i}`),
      }
   }

   // Helper methods for testing
   /**
    * Testing utility to retrieve sent messages by category.
    * 
    * @param type - Optional filter tag.
    * @returns Array of saved payloads.
    */
   getSentMessages(type?: 'notification' | 'email' | 'text'): SentMessage[] {
      if (type) {
         return this.sentMessages.filter((msg) => msg.type === type)
      }
      return this.sentMessages
   }

   /**
    * Erases the internal mock history log.
    */
   clearMessages(): void {
      this.sentMessages = []
   }

   /**
    * Retrieves the total count of mock-sent payloads.
    * 
    * @param type - Optional filter tag.
    * @returns Total matching elements.
    */
   getMessageCount(type?: 'notification' | 'email' | 'text'): number {
      return this.getSentMessages(type).length
   }

   /**
    * Peeks at the most recently dispatched message.
    * 
    * @param type - Optional filter tag.
    * @returns SentMessage representation.
    */
   getLastMessage(
      type?: 'notification' | 'email' | 'text'
   ): SentMessage | undefined {
      const messages = this.getSentMessages(type)
      return messages[messages.length - 1]
   }
}
