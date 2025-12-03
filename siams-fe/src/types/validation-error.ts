export interface ValidationError {
  error: string,
  message: string,
  status: number,
  details: {
    field: string, message: string
  }[]
}
