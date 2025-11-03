import { IError } from '@shared/interfaces'

export class TokenError extends Error implements IError {
  public name = 'TokenError'
  public httpStatus = 401

  constructor(public message: string = 'Your token is invalid or expired',) {
    super(message)
  }
}
