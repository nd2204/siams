import { IRepository } from "@/shared/interfaces";
import { AuthUser } from "@domain/entities";

export interface IUserRepository extends IRepository<AuthUser> {
  findForAuth(email: string): Promise<AuthUser | undefined>;
}
