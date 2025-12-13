import { Permission, PermissionKey, Role } from "@domain/entities";
import { RoleId, RoleName } from "@domain/entities/user-role";
import { IRepository } from "@shared/interfaces";

export type RoleNamePermissionMap = Record<RoleName, Set<PermissionKey>>

export type RoleIdPermissionMap = Record<RoleId, {
  role_name: RoleName
  permissions: Set<PermissionKey>
}>

export interface IRoleRepository extends IRepository<Role> {
  findPermissionsByRoleId(roleId: string): Promise<Permission[]>;
  getRoleIdPermissionMap(): Promise<RoleIdPermissionMap>
  getRoleNamePermissionMap(): Promise<RoleNamePermissionMap>;
}
