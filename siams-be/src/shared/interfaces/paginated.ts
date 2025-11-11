export interface IPaginated<T> {
  data: T[]
  meta?: any,
  pagination: {
    total: number,
    page: number
    perPage: number
  }
}
