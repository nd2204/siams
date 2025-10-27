import { Permission, Role } from "@domain/entities";
import { PermissionKey } from "@domain/entities/user-permission";
import { IRepository } from "@shared/interfaces";

export interface IRoleRepository extends IRepository<Role> {
  findPermissionsByRoleId(roleId: string): Promise<Permission[]>;
  getRolePermissionMap(): Promise<Record<string, PermissionKey[]>>;
}
