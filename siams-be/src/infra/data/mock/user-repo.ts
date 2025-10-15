import services from "@/config/services";
import { AuthUser, User } from "@/domain/entities";
import { IUserRepository } from "@/domain/interfaces";
import { ILogger, IPaginated } from "@/shared/interfaces";

export class UserRepositoryMock implements IUserRepository {
  users?: AuthUser[]

  constructor(
    protected encryptPassword: (password: string) => Promise<{ password: string, salt: string }>,
    protected logger: ILogger,
  ) { }

  async init() {
    this.users = [
      new AuthUser({
        id: "f73ef5cc-fd2f-4664-ad13-363b555d0648",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        ...(await this.encryptPassword("password0"))
      }),
    ]
  }

  async findForAuth(email: string): Promise<AuthUser | undefined> {
    if (!this.users) { await this.init() }
    const authUser = this.users?.find((value) => value.email == email);
    return new Promise((resolve, reject) => resolve(authUser))
  }

  findOneBy(filters: Partial<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }
  findAllBy(filters: Partial<User>): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  listBy(filters: Partial<User>, page: number, perPage: number): Promise<IPaginated<User>> {
    throw new Error("Method not implemented.");
  }
  create(payload: Partial<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }
  update(id: string, payload: Partial<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
