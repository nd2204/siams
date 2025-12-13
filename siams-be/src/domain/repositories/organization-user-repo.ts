import {
  OrganizationUser,
  PermissionKey,
  Role,
  RoleName,
} from "@domain/entities";
import { UserId } from "@domain/entities/user";
import { IPaginated, IRepository } from "@shared/interfaces";

export interface OrgUserDTO {
  user_id: UserId,
  user_email: string,
  user_name: string
  role_name: RoleName,
  role_permissions: Set<PermissionKey>
  joined_at: Date
}

export interface IOrganizationUserRepository extends IRepository<OrganizationUser> {
  listOrgUsers(orgId: string, page: number, perPage: number): Promise<IPaginated<OrgUserDTO>>;
  addUserToOrg(org_id: string, user_id: string, role: Partial<Role>): Promise<OrganizationUser>;
}
