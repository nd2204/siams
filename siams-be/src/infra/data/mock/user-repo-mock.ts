import services from "@/config/services";
import { AuthUser, User } from "@domain/entities";
import { IUserRepository } from "@domain/repositories";
import { ILogger, IPaginated } from "@shared/interfaces";

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

  findOneBy(filters: Partial<AuthUser>): Promise<AuthUser | undefined> {
    throw new Error("Method not implemented.");
  }
  findAllBy(filters: Partial<AuthUser>): Promise<AuthUser[]> {
    throw new Error("Method not implemented.");
  }
  listBy(filters: Partial<AuthUser>, page: number, perPage: number): Promise<IPaginated<AuthUser>> {
    throw new Error("Method not implemented.");
  }
  create(payload: Partial<AuthUser>): Promise<AuthUser> {
    throw new Error("Method not implemented.");
  }
  update(id: number | string, payload: Partial<AuthUser>): Promise<AuthUser> {
    throw new Error("Method not implemented.");
  }

  async findForAuth(email: string): Promise<AuthUser | undefined> {
    if (!this.users) { await this.init() }
    const authUser = this.users?.find((value) => value.email == email);
    return new Promise((resolve, reject) => resolve(authUser))
  }

  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}
