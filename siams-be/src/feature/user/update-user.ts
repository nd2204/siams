import { User } from "@/domain/entities";
import { IUseCase } from "@/shared/interfaces";

export class UpdateUserUC implements IUseCase<boolean> {
  async call(...args: unknown[]): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
