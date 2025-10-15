import { IRepository } from "@/shared/interfaces";
import { AuthUser, User } from "@domain/entities";

export interface IUserRepository extends IRepository<User> {
  findForAuth(email: string): Promise<AuthUser | undefined>;
}
