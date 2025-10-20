import { User } from "@/domain/entities";
import { IUseCase, IValidator } from "@/shared/interfaces";

export class AuthorizeAdminUC implements IUseCase<User> {
  constructor(
    protected validator: IValidator<User>
  ) { }

  call(...args: unknown[]): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
