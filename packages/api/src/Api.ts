import { ServerAdapter } from './types'
import { Core } from '@quatrain/core'

/**
 * Core registry for managing and retrieving configured API Server instances.
 */
export class Api extends Core {
   private static servers: Map<string, ServerAdapter> = new Map()
   /** Core logger dedicated to Api actions. */
   static logger = this.addLogger('Api')


   /**
    * Registers a new server adapter in the global registry.
    * 
    * @param adapter - The server adapter instance.
    * @param name - The identifier for this server. Defaults to 'default'.
    */
   static addServer(adapter: ServerAdapter, name: string = 'default'): void {
      Api.servers.set(name, adapter)
   }

   /**
    * Retrieves a server adapter from the global registry.
    * 
    * @param name - The identifier for the server. Defaults to 'default'.
    * @returns The server adapter instance.
    * @throws Error if the server adapter is not found.
    */
   static getServer(name: string = 'default'): ServerAdapter {
      const adapter = Api.servers.get(name)
      if (!adapter) {
         throw new Error(`Server '${name}' not found`)
      }
      return adapter
   }
}
