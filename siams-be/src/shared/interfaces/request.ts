export interface IRequest {
  token?: string
  params?: Record<string, string | number | boolean>
  query?: Record<string, string | number | boolean>,
  body?: any
}
