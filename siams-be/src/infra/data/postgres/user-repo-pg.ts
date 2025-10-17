import { AuthUser } from "@domain/entities";
import { IUserRepository } from "@domain/repositories";
import { type Pool } from "pg";
import { PostgresRepositoryBase } from "./postgres-repo-base";
import { NotFoundError } from "@shared/errors";

export class UserRepositoryPg
  extends PostgresRepositoryBase<AuthUser>
  implements IUserRepository {

  constructor(
    protected readonly pool: Pool
  ) {
    super(pool, "users", {
      id: "id",
      orgId: "org_id",
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      password: "password",
      salt: "salt"
    }, (row: any) =>
      new AuthUser({
        id: row["id"],
        orgId: row["org_id"],
        firstName: row["first_name"],
        lastName: row["last_name"],
        email: row["email"],
        password: row["password"],
        salt: row["salt"]
      })
    )
  }

  async findForAuth(email: string): Promise<AuthUser | undefined> {
    const result = await this.findOneBy({ email })
    if (!result) {
      throw new NotFoundError(`User with email="${email}" not found`);
    }
    return result;
  }
}
