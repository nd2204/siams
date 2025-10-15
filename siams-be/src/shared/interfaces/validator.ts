export interface IValidationResult<T> {
  value: T
  errors?: { field: string, message: string }[]
}

export interface IValidator<T> {
  validate(body: Partial<T>): IValidationResult<T>
}
