import { Permission, Role } from "@domain/entities";
import { type Pool } from "pg";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { IRoleRepository } from "@domain/repositories";
import { RoleName } from "@domain/entities/user-role";
import { PermissionKey } from "@domain/entities/user-permission";

export class RoleRepositoryPg
  extends PostgresRepositoryBase<Role>
  implements IRoleRepository {

  constructor(
    protected readonly pool: Pool
  ) {
    const mapping: Record<keyof Role, string> = {
      id: "id",
      name: "name",
      description: "description",
      isGlobal: "is_global",
      createdAt: "created_at"
    }

    super(pool, "roles", mapping, (row: any) =>
      new Role({
        id: row[mapping.id],
        name: row[mapping.name],
        description: row[mapping.description],
        isGlobal: row[mapping.isGlobal],
        createdAt: row[mapping.createdAt]
      })
    )
  }

  async getRolePermissionMap(): Promise<Record<string, PermissionKey[]>> {
    const sql = `
      SELECT r.name AS role_name, p.key AS permission_key
      FROM roles r
      JOIN role_permissions rp ON rp.role_id = r.id
      JOIN permissions p ON p.id = rp.permission_id
      ORDER BY r.name
    `;
    const res = await this.pool.query(sql);
    const map: Record<string, PermissionKey[]> = {};

    for (const row of res.rows) {
      if (!map[row.role_name]) map[row.role_name] = [];
      map[row.role_name].push(row.permission_key);
    }
    return map;
  }

  async findPermissionsByRoleId(roleId: string): Promise<Permission[]> {
    const sql = `
      SELECT p.id, p.key, p.description
      FROM role_permissions rp
      JOIN permissions p ON p.id = rp.permission_id
      WHERE rp.role_id = $1
    `;
    const res = await this.pool.query(sql, [roleId]);
    return res.rows.map((row) => ({
      id: row.id,
      key: row.key,
      description: row.description,
    }));
  }
}
