import { User } from "@/domain/entities/user";
import { IUseCase } from "@/shared/interfaces";

export class RegisterUserUC implements IUseCase<User> {
  async call(...args: unknown[]): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
