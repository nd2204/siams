import { User } from "@domain/entities";
import { IUserRepository } from "@domain/repositories";
import { type Pool } from "pg";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { NotFoundError } from "@shared/errors";

export class UserRepositoryPg
  extends PostgresRepositoryBase<User>
  implements IUserRepository {

  constructor(
    protected readonly pool: Pool
  ) {
    const mapping: Record<keyof User, string> = {
      id: "id",
      name: "name",
      email: "email",
      password: "password",
      salt: "salt"
    }

    super(pool, "users", mapping, (row: any) =>
      new User({
        id: row[mapping.id],
        name: row[mapping.name],
        email: row[mapping.email],
        password: row[mapping.password],
        salt: row[mapping.salt]
      })
    )
  }

  async findForAuth(email: string): Promise<User | undefined> {
    const result = await this.findOneBy({ email })
    return result;
  }
}
