import { CacheAdapterInterface } from '@quatrain/cache'
import { RedisManager } from './RedisManager'
import { RedisOptions } from 'ioredis'

/**
 * Concrete cache adapter implementation utilizing Redis via ioredis.
 */
export class RedisCacheAdapter implements CacheAdapterInterface {
   private _manager: RedisManager

   constructor(options?: RedisOptions | string) {
      this._manager = RedisManager.getInstance(options)
   }

   public get manager(): RedisManager {
      return this._manager
   }

   /**
    * Retrieves a string value by key.
    * 
    * @param key - The cache key.
    * @returns The resolved string or null.
    */
   public async get(key: string): Promise<string | null> {
      return this._manager.client.get(key)
   }

   /**
    * Retrieves a raw buffer value by key.
    * 
    * @param key - The cache key.
    * @returns The resolved Buffer or null.
    */
   public async getBuffer(key: string): Promise<Buffer | null> {
      return this._manager.client.getBuffer(key)
   }

   /**
    * Stores a value in Redis with an optional TTL.
    * 
    * @param key - The target key.
    * @param value - String or binary payload.
    * @param ttlSeconds - Expiration time in seconds.
    */
   public async set(key: string, value: string | Buffer, ttlSeconds?: number): Promise<void> {
      if (ttlSeconds !== undefined && ttlSeconds > 0) {
         await this._manager.client.set(key, value, 'EX', ttlSeconds)
      } else {
         await this._manager.client.set(key, value)
      }
   }

   /**
    * Deletes one or more keys from the cache.
    * 
    * @param keys - Rest array of keys to remove.
    */
   public async del(...keys: string[]): Promise<void> {
      if (keys.length > 0) {
         await this._manager.client.del(...keys)
      }
   }

   /**
    * Locates all cache keys matching a specific pattern.
    * 
    * @param pattern - Glob-style key matcher.
    * @returns List of matching keys.
    */
   public async keys(pattern: string): Promise<string[]> {
      return this._manager.client.keys(pattern)
   }
}
