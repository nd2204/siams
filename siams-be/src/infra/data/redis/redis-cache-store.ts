import { ICacheStore } from '@domain/interfaces/cache-store';
import { RedisClientType } from 'redis'

export class RedisCacheStore implements ICacheStore {
  constructor(private client: RedisClientType) {
    this.client.connect();
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }
  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1
  }

  async set<T>(key: string, value: T, ttl_sec?: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), { EX: ttl_sec });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }
}
