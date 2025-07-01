import { Core } from '@quatrain/core'
import { NotificationCapableAdapter } from './types/NotificationCapableAdapter'
import { EmailCapableAdapter } from './types/EmailCapableAdapter'
import { TextCapableAdapter } from './types/TextCapableAdapter'

export type MessagingRegistry<T extends NotificationCapableAdapter
         | EmailCapableAdapter
         | TextCapableAdapter> = {
   [x: string]: T
}

export interface MessagingParameters {
   config?: any
   debug?: boolean
}

export class Messaging extends Core {
   static defaultMessager = 'default'
   static logger = this.addLogger('Messaging')

   protected static _messagers: MessagingRegistry<any> = {}

   static addMessager(
      messager:
         | NotificationCapableAdapter
         | EmailCapableAdapter
         | TextCapableAdapter,
      alias: string,
      setDefault: boolean = false
   ) {
      this._messagers[alias] = messager
      if (setDefault) {
         this.defaultMessager = alias
      }
   }

   static getMessager(alias: string = this.defaultMessager) {
      if (this._messagers[alias]) {
         return this._messagers[alias]
      } else {
         throw new Error(`Unknown messager alias: '${alias}'`)
      }
   }
}
