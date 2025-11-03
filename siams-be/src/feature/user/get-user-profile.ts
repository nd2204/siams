import { User } from "@/domain/entities";
import { IUseCase } from "@/shared/interfaces";

export class UserProfileUC implements IUseCase<User> {
  async call(...args: unknown[]): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
