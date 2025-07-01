import { MessagingRecipient } from './MessagingRecipient'
import { NotificationMessage } from './NotificationMessage'

export interface NotificationCapableAdapter {
   sendNotification(
      recipient: MessagingRecipient,
      message: NotificationMessage
   ): Promise<any>

   sendNotifications(
      recipients: MessagingRecipient[],
      message: NotificationMessage
   ): Promise<any>
}
