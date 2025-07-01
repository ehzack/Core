import { MessagingRecipient } from './MessagingRecipient'
import { NotificationMessage } from './NotificationMessage'

export interface EmailCapableAdapter {
   sendEmail(
      recipient: MessagingRecipient,
      message: NotificationMessage
   ): Promise<any>

   sendEmails(
      recipients: MessagingRecipient[],
      message: NotificationMessage
   ): Promise<any>
}
