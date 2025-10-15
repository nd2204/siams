import type Entity from "@/domain/entity";
import { IPaginated } from "./paginated";

export interface IRepository<T> {
  findOneBy(filters: Partial<T>): Promise<T>
  findAllBy(filters: Partial<T>): Promise<T[]>
  listBy(filters: Partial<T>, page: number, perPage: number): Promise<IPaginated<T>>
  create(payload: Partial<T>): Promise<T>
  update(id: number | string, payload: Partial<T>): Promise<T>
  delete(id: number | string): Promise<boolean>
}
