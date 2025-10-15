export interface IValidationResult<T> {
  errors?: { field: string, message: string }[]
  value: T
}

export interface IValidator<T> {
  validate(body: Partial<T>): IValidationResult<T>
}
