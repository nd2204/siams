export class UserRegisterRequest {
  constructor(
    public email?: string,
    public password?: string,
    public firstName?: string,
    public lastName?: string,
  ) { }
}
