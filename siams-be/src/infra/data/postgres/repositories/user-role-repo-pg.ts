import { Permission, Role } from "@domain/entities";
import { type Pool } from "pg";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { IRoleRepository } from "@domain/repositories";
import { RoleId } from "@domain/entities/user-role";
import { RoleIdPermissionMap, RoleNamePermissionMap } from "@domain/repositories/user-role-repo";

export class RoleRepositoryPg
  extends PostgresRepositoryBase<Role>
  implements IRoleRepository {

  private _perms_cache: RoleIdPermissionMap | null = null

  constructor(
    protected readonly pool: Pool,
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

  async getRoleIdPermissionMap(): Promise<RoleIdPermissionMap> {
    if (this._perms_cache) {
      return this._perms_cache;
    }

    const sql = `
      SELECT 
        r.${this.columns.id} as role_id,
        r.${this.columns.name} AS role_name,
        p.key AS permission_key
      FROM roles r
      JOIN role_permissions rp ON rp.role_id = r.id
      JOIN permissions p ON p.id = rp.permission_id
      ORDER BY r.name
    `;
    const res = await this.pool.query(sql);
    const map: RoleIdPermissionMap = {};

    for (const row of res.rows) {
      const id = row.role_id as RoleId
      if (!map[id]) map[id] = { permissions: new Set(), role_name: row.role_name };
      map[id].permissions.add(row.permission_key);
    }

    this._perms_cache = map;
    return map;
  }

  async getRoleNamePermissionMap(): Promise<RoleNamePermissionMap> {
    const sql = `
      SELECT
        r.${this.columns.name} AS role_name,
        p.key AS permission_key,
        p.description AS permission_description
      FROM roles r
      JOIN role_permissions rp ON rp.role_id = r.id
      JOIN permissions p ON p.id = rp.permission_id
      ORDER BY r.name
    `;
    const res = await this.pool.query(sql);

    const map: RoleNamePermissionMap = {
      SUPER_ADMIN: new Set(),
      ORG_OWNER: new Set(),
      ORG_ADMIN: new Set(),
      ORG_OPERATOR: new Set(),
      ORG_VIEWER: new Set()
    };

    for (const row of res.rows) {
      if (!map[row.role_name]) map[row.role_name] = [];
      map[row.role_name].add(row.permission_key);
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
