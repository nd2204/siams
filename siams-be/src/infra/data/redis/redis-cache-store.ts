import { ICacheStore } from '@domain/interfaces/cache-store';
import { RedisClientType } from 'redis'

export class RedisCacheStore implements ICacheStore {
  constructor(private client: RedisClientType) {
    this.client.connect();
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }
}
