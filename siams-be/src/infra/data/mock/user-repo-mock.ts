import { User } from "@domain/entities";
import { IUserRepository } from "@domain/repositories";
import { MockRepoBase } from "./repo-mock-base";

export class UserRepositoryMock
  extends MockRepoBase<User>
  implements IUserRepository {

  constructor() {
    super();
  }

  findForAuth(email: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
}
