import { CacheAdapterInterface } from './CacheAdapterInterface'
import { Core } from '@quatrain/core'

/**
 * Global singleton cache registry holding references to instantiated cache adapters.
 */
export class Cache extends Core {
   private static _adapters: Map<string, CacheAdapterInterface> = new Map()

   /**
    * Registers a new cache adapter under a given namespace.
    * 
    * @param name - The identifier for the cache instance.
    * @param adapter - The configured cache adapter.
    */
   public static register(name: string, adapter: CacheAdapterInterface): void {
      this._adapters.set(name, adapter)
   }

   /**
    * Retrieves a previously registered cache adapter by name.
    * 
    * @param name - The cache identifier.
    * @returns The corresponding adapter or undefined.
    */
   public static get(name: string): CacheAdapterInterface | undefined {
      return this._adapters.get(name)
   }

   /**
    * Returns all currently registered cache adapters.
    * 
    * @returns Array of cache adapters.
    */
   public static getAll(): CacheAdapterInterface[] {
      return Array.from(this._adapters.values())
   }

   /**
    * Removes a cache adapter from the registry.
    * 
    * @param name - The name to deregister.
    */
   public static unregister(name: string): void {
      this._adapters.delete(name)
   }

   /**
    * Flushes the internal map of registered cache adapters.
    */
   public static clearRegistry(): void {
      this._adapters.clear()
   }
}
