import { IPaginated, IRepository } from "@shared/interfaces";

export class MockRepoBase<T> implements IRepository<T> {
  findOneBy(filters: Partial<T>): Promise<T | undefined> {
    throw new Error("Method not implemented.");
  }
  findAllBy(filters: Partial<T>): Promise<T[]> {
    throw new Error("Method not implemented.");
  }
  listBy(filters: Partial<T>, page: number, perPage: number): Promise<IPaginated<T>> {
    throw new Error("Method not implemented.");
  }
  upsert(payload: Partial<T>, conflict_keys: (keyof T)[]): Promise<T> {
    throw new Error("Method not implemented.");
  }
  create(payload: Partial<T>): Promise<T> {
    throw new Error("Method not implemented.");
  }
  update(id: number | string, payload: Partial<T>): Promise<T> {
    throw new Error("Method not implemented.");
  }
  delete(id: number | string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
