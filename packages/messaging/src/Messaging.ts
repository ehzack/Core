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

/**
 * Singleton Registry dispatching text messages, emails, or push notifications.
 */
export class Messaging extends Core {
   /** The alias for the primary fallback messager instance. */
   static defaultMessager = 'default'
   /** Scoped domain logger. */
   static logger = this.addLogger('Messaging')

   protected static _messagers: MessagingRegistry<any> = {}

   /**
    * Wires an instantiated messaging client into the global routing map.
    * 
    * @param messager - The adapter logic handling the sends.
    * @param alias - Registered alias label.
    * @param setDefault - Whether this is the new system default router.
    */
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

   /**
    * Recovers a registered messager by alias.
    * 
    * @param alias - The name identifier.
    * @returns The requested messaging provider.
    * @throws If the alias was never registered.
    */
   static getMessager(alias: string = this.defaultMessager) {
      if (this._messagers[alias]) {
         return this._messagers[alias]
      } else {
         throw new Error(`Unknown messager alias: '${alias}'`)
      }
   }
}
