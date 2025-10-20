import { IRepository } from "@/shared/interfaces";
import { User } from "@domain/entities";

export interface IUserRepository extends IRepository<User> {
  findForAuth(email: string): Promise<User | undefined>;
}
