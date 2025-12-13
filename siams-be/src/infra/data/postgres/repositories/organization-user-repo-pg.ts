import { OrganizationUser, Role, RoleName } from "@domain/entities";
import { IOrganizationUserRepository, IRoleRepository } from "@domain/repositories";
import { OrgUserDTO } from "@domain/repositories/organization-user-repo";
import { RoleIdPermissionMap } from "@domain/repositories/user-role-repo";
import { PostgresRepositoryBase } from "@infra/data/postgres/postgres-repo-base";
import { IPaginated } from "@shared/interfaces";
import { type Pool } from "pg";
import { v4 as uuidv4 } from "uuid"

export class OrganizationUserRepositoryPg
  extends PostgresRepositoryBase<OrganizationUser>
  implements IOrganizationUserRepository {

  constructor(
    pool: Pool,
    private roleRepo: IRoleRepository,
  ) {
    const mapping: Record<keyof OrganizationUser, string> = {
      id: "id",
      orgId: "org_id",
      userId: "user_id",
      roleId: "role_id",
      invitedBy: "invited_by",
      acceptedAt: "accepted_at",
      createdAt: "created_at",
      updatedAt: "update_at"
    }

    super(
      pool,
      "organization_users",
      mapping,
      (row) => {
        return new OrganizationUser({
          id: row[mapping.id],
          orgId: row[mapping.orgId],
          userId: row[mapping.userId],
          roleId: row[mapping.roleId],
          invitedBy: row[mapping.invitedBy],
          acceptedAt: row[mapping.acceptedAt],
          createdAt: row[mapping.createdAt],
          updatedAt: row[mapping.updatedAt]
        })
      }
    )
  }

  async addUserToOrg(org_id: string, user_id: string, role_filter: Partial<Role>) {
    const role = await this.roleRepo.findOneBy(role_filter)

    if (!role) {
      throw new Error("Role does not exist")
    }

    return this.create({
      id: uuidv4(),
      orgId: org_id,
      userId: user_id,
      roleId: role.id,
    })
  }

  async listOrgUsers(orgId: string, page: number, perPage: number): Promise<IPaginated<OrgUserDTO>> {
    const sql = `
      SELECT 
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        ou.${this.columns.roleId} as role_id,
        ou.${this.columns.createdAt} as joined_at
        ${this.geometrySelectSql("ou")}
      FROM ${this.tableName} ou
      JOIN users u ON u.id = ou.user_id
      WHERE ou.${this.columns.orgId} = $1
      OFFSET $2
      LIMIT $3
    `;
    const countSql = `
      SELECT COUNT(*)
      FROM ${this.tableName} ou
      JOIN users u ON u.id = ou.user_id
      WHERE ou.${this.columns.orgId} = $1
    `;

    const offset = (page - 1) * perPage;
    const res = await this.pool.query(sql, [orgId, offset, perPage]);
    const countRes = await this.pool.query(countSql, [orgId]);

    const map: RoleIdPermissionMap = await this.roleRepo.getRoleIdPermissionMap();

    return {
      data: res.rows.map(
        r => {
          return {
            user_id: r.user_id,
            user_name: r.user_name,
            user_email: r.user_email,
            role_name: map[r.role_id].role_name,
            role_permissions: map[r.role_id].permissions,
            joined_at: r.joined_at
          }
        }
      ),
      pagination: {
        total: parseInt(countRes.rows[0].count, 10),
        page,
        perPage,
      }
    };
  }
}
