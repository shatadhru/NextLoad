import Redis from 'ioredis'

// In-Memory Fallback Cache Storage
interface MemoryEntry {
  value: any
  expiresAt: number | null
}

const memoryStore = new Map<string, MemoryEntry>()

// Clean up expired in-memory items periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of memoryStore.entries()) {
      if (entry.expiresAt && entry.expiresAt <= now) {
        memoryStore.delete(key)
      }
    }
  }, 5 * 60 * 1000).unref?.()
}

// Lazy Redis Singleton
let redisClient: Redis | null = null
let redisAvailable = false

function getRedisClient(): Redis | null {
  const redisUrl = process.env.REDIS_URL

  if (!redisUrl) {
    return null
  }

  if (redisClient) {
    return redisClient
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
      enableOfflineQueue: false,
      retryStrategy(times) {
        if (times > 3) {
          redisAvailable = false
          return null
        }
        return Math.min(times * 200, 2000)
      },
    })

    redisClient.on('connect', () => {
      redisAvailable = true
      console.log('⚡ [Cache] Redis connected successfully')
    })

    redisClient.on('error', (err) => {
      redisAvailable = false
      console.warn('⚠️ [Cache] Redis connection issue, fallback to in-memory cache:', err.message)
    })

    redisClient.connect().catch(() => {
      redisAvailable = false
    })

    return redisClient
  } catch (err: any) {
    redisAvailable = false
    console.warn('⚠️ [Cache] Failed to initialize Redis client, using in-memory cache:', err.message)
    return null
  }
}

/**
 * Universal Hybrid Cache:
 * - Automatically uses Redis if REDIS_URL is in .env
 * - Automatically falls back to In-Memory cache if REDIS_URL is missing or unreachable
 */
export const cache = {
  /**
   * Get an item from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const redis = getRedisClient()

    if (redis && redisAvailable) {
      try {
        const raw = await redis.get(key)
        if (raw !== null) {
          return JSON.parse(raw) as T
        }
        return null
      } catch {
        // Fall through to memoryStore on error
      }
    }

    // In-Memory Fallback
    const entry = memoryStore.get(key)
    if (!entry) return null

    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      memoryStore.delete(key)
      return null
    }

    return entry.value as T
  },

  /**
   * Set an item in cache with optional TTL in seconds
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const redis = getRedisClient()

    if (redis && redisAvailable) {
      try {
        const serialized = JSON.stringify(value)
        if (ttlSeconds && ttlSeconds > 0) {
          await redis.set(key, serialized, 'EX', ttlSeconds)
        } else {
          await redis.set(key, serialized)
        }
        return
      } catch {
        // Fall through to memoryStore on error
      }
    }

    // In-Memory Fallback
    const expiresAt = ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : null
    memoryStore.set(key, { value, expiresAt })
  },

  /**
   * Delete one or multiple keys
   */
  async del(key: string | string[]): Promise<void> {
    const keys = Array.isArray(key) ? key : [key]
    if (keys.length === 0) return

    const redis = getRedisClient()
    if (redis && redisAvailable) {
      try {
        await redis.del(...keys)
      } catch {
        // Fall through
      }
    }

    for (const k of keys) {
      memoryStore.delete(k)
    }
  },

  /**
   * Check if a key exists
   */
  async has(key: string): Promise<boolean> {
    const val = await this.get(key)
    return val !== null
  },

  /**
   * Status check: returns true if Redis is active, false if In-Memory fallback
   */
  isRedis(): boolean {
    return Boolean(process.env.REDIS_URL && redisAvailable)
  },
}

export default cache
