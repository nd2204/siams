export interface ICacheStore {
  set<T>(key: string, value: T, ttl_sec?: number): Promise<void>;
  get<T>(key: string): Promise<T | null>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}
