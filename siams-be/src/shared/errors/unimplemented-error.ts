import { IError } from '@shared/interfaces'

export class UnimplementedError extends Error implements IError {
  public name = 'UnimplementedError'
  public httpStatus = 500

  constructor(
    public functionName: string,
  ) {
    super(`${functionName} is not implemented`)
  }
}
