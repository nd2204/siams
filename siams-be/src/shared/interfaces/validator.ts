export interface IValidationError {
  field: string,
  message: string
}

export interface IValidationResult<T> {
  value: T
  errors?: IValidationError[]
}

export interface IValidator<T> {
  validate(body: Partial<T>): IValidationResult<T>
}
