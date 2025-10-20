import { User } from "@domain/entities";
import { IUserRepository } from "@domain/repositories";
import { ILogger, IPaginated } from "@shared/interfaces";

export class UserRepositoryMock implements IUserRepository {
  users?: User[]

  constructor(
    protected encryptPassword: (password: string) => Promise<{ password: string, salt: string }>,
    protected logger: ILogger,
  ) { }
  findForAuth(email: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  findOneBy(filters: Partial<User>): Promise<User | undefined> {
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
  update(id: number | string, payload: Partial<User>): Promise<User> {
    throw new Error("Method not implemented.");
  }
  delete(id: number | string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async init() {
    this.users = [
      new User({
        id: "f73ef5cc-fd2f-4664-ad13-363b555d0648",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        ...(await this.encryptPassword("password0"))
      }),
    ]
  }
}
