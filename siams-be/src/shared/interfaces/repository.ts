import { IPaginated } from "./paginated";

export interface IRepository<T> {
  findOneBy(filters: Partial<T>): Promise<T | undefined>
  findAllBy(filters: Partial<T>): Promise<T[]>
  listBy(filters: Partial<T>, page: number, perPage: number): Promise<IPaginated<T>>
  upsert(payload: Partial<T>, conflict_keys: (keyof T)[]): Promise<T>
  create(payload: Partial<T>): Promise<T>
  update(id: number | string, payload: Partial<T>): Promise<T>
  delete(id: number | string): Promise<boolean>
}
