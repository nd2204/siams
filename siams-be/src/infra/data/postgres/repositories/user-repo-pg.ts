import { User } from "@domain/entities";
import { IUserRepository } from "@domain/repositories";
import { type Pool } from "pg";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";

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
      salt: "salt",
      created_at: "created_at",
      is_active: "is_active"
    }

    super(pool, "users", mapping, (row: any) =>
      new User({
        id: row[mapping.id],
        name: row[mapping.name],
        email: row[mapping.email],
        password: row[mapping.password],
        salt: row[mapping.salt],
        created_at: row[mapping.created_at],
        is_active: row[mapping.is_active]
      })
    )
  }

  async findForAuth(email: string): Promise<User | undefined> {
    const result = await this.findOneBy({ email })
    return result;
  }
}
