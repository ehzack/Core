import { MessagingRecipient } from './MessagingRecipient'
import { NotificationMessage } from './NotificationMessage'

export interface TextCapableAdapter {
   sendTextMessage(
      recipient: MessagingRecipient,
      message: NotificationMessage
   ): Promise<any>

   sendTextMessages(
      recipients: MessagingRecipient[],
      message: NotificationMessage
   ): Promise<any>
}
