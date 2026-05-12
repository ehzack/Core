import Redis from 'ioredis'
import { Api } from '@quatrain/api'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
export const redis = new Redis(REDIS_URL)

redis.on('connect', () => Api.info(`[Redis] Connected to ${REDIS_URL}`))
redis.on('error', (err) => Api.error(`[Redis] Error:`, err))

/**
 * Retrieves a cached string payload from Redis by its key.
 * 
 * @param key - The unique cache key for the payload.
 * @returns A promise resolving to the cached string, or null if not found or an error occurs.
 */
export async function getCachedPayload(key: string): Promise<string | null> {
  try {
    return await redis.get(key)
  } catch (err) {
    Api.error(`[Redis] Failed to get cache key ${key}:`, err)
    return null
  }
}

/**
 * Stores a string payload into Redis with a specified time-to-live.
 * 
 * @param key - The unique cache key for the payload.
 * @param data - The string data to cache.
 * @param ttlSeconds - Time-to-live in seconds (default is 3600).
 * @returns A promise resolving when the operation completes.
 */
export async function setCachedPayload(key: string, data: string, ttlSeconds: number = 3600): Promise<void> {
  try {
    await redis.setex(key, ttlSeconds, data)
  } catch (err) {
    Api.error(`[Redis] Failed to set cache key ${key}:`, err)
  }
}

/**
 * Retrieves a binary media buffer from Redis by its key.
 * 
 * @param key - The unique cache key for the media buffer.
 * @returns A promise resolving to the Buffer, or null if not found or an error occurs.
 */
export async function getMediaBuffer(key: string): Promise<Buffer | null> {
  try {
    return await redis.getBuffer(key)
  } catch (err) {
    Api.error(`[Redis] Failed to get media buffer for key ${key}:`, err)
    return null
  }
}

/**
 * Stores a binary media buffer into Redis with a specified time-to-live.
 * 
 * @param key - The unique cache key for the media buffer.
 * @param buffer - The binary Buffer to cache.
 * @param ttlSeconds - Time-to-live in seconds (default is 86400).
 * @returns A promise resolving when the operation completes.
 */
export async function setMediaBuffer(key: string, buffer: Buffer, ttlSeconds: number = 86400): Promise<void> {
  try {
    await redis.setex(key, ttlSeconds, buffer)
  } catch (err) {
    Api.error(`[Redis] Failed to set media buffer for key ${key}:`, err)
  }
}

/**
 * Invalidates all JSON cache keys for a specific resource path across ALL users.
 * 
 * @param path - The resource path (e.g. /api/environments/...)
 * @returns A promise resolving when the operation completes.
 */
export async function invalidateResourceCache(path: string): Promise<void> {
  try {
    const parts = path.split('/')
    if (parts.length < 3) return
    
    // Extract base path, e.g., "/api/environments"
    const basePath = `/${parts[1]}/${parts[2]}`

    let cursor = '0'
    let count = 0
    do {
      const [newCursor, keys] = await redis.scan(cursor, 'MATCH', `api:cache:*:${basePath}*`, 'COUNT', 100)
      cursor = newCursor
      if (keys.length > 0) {
        await redis.del(...keys)
        count += keys.length
      }
    } while (cursor !== '0')
    if (count > 0) {
      Api.info(`[Redis] Invalidated ${count} cache keys for resource ${basePath}`)
    }
  } catch (err) {
    Api.error(`[Redis] Failed to invalidate cache for resource ${path}:`, err)
  }
}
