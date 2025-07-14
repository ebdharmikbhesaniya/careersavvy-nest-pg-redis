/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/global/constants/redis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  /**
   * Set a value in Redis
   * @param key Redis key
   * @param value Data to store
   * @param options Optional: TTL (in seconds), prefix, JSON stringify
   */
  async set(
    key: string,
    value: unknown,
    options?: {
      ttl?: number;
      prefix?: string;
      stringify?: boolean;
    },
  ): Promise<void> {
    try {
      const finalKey = this.buildKey(key, options?.prefix);

      let data: string;
      if (options?.stringify === false && typeof value === 'string') {
        data = value;
      } else {
        data = JSON.stringify(value);
      }

      if (options?.ttl) {
        await this.redis.set(finalKey, data, 'EX', options.ttl);
      } else {
        await this.redis.set(finalKey, data);
      }
    } catch (err: any) {
      this.logger.error(`Redis SET failed: ${err.message}`, err.stack);
    }
  }

  /**
   * Get a value from Redis
   * @param key Redis key
   * @param options Optional: prefix, parse JSON
   */
  async get<T = any>(
    key: string,
    options?: {
      prefix?: string;
      parse?: boolean;
    },
  ): Promise<T | string | null> {
    try {
      const finalKey = this.buildKey(key, options?.prefix);
      const value = await this.redis.get(finalKey);

      if (!value) return null;

      if (options?.parse === false) {
        return value;
      }

      // parse and cast safely
      const parsed: unknown = JSON.parse(value);

      // You can add runtime validation here if needed

      return parsed as T;
    } catch (err) {
      this.logger.error(`Redis GET failed: ${err.message}`, err.stack);
      return null;
    }
  }

  /**
   * Delete a key from Redis
   * @param key Redis key
   * @param prefix Optional key prefix
   */
  async del(key: string, prefix?: string): Promise<void> {
    try {
      const finalKey = this.buildKey(key, prefix);
      await this.redis.del(finalKey);
    } catch (err) {
      this.logger.error(`Redis DEL failed: ${err.message}`, err.stack);
    }
  }

  /**
   * Helper to check if a key exists
   */
  async exists(key: string, prefix?: string): Promise<boolean> {
    const finalKey = this.buildKey(key, prefix);
    const result = await this.redis.exists(finalKey);
    return result === 1;
  }

  /**
   * Append a prefix to a key (namespace)
   */
  private buildKey(key: string, prefix?: string): string {
    return prefix ? `${prefix}:${key}` : key;
  }
}
