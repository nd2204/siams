export interface IBucketOf<T> {
  bucket_name: string;
  meta?: any
  data: T[]
}
