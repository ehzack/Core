import { UserType } from '@quatrain/core'

export type MessagingRecipient = Pick<
   UserType,
   'firstname' | 'lastname' | 'email' | 'messageToken'
> & { data?: { [x: string]: any } }
