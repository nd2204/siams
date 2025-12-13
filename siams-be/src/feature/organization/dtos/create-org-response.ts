import { PermissionKey, RoleName } from "@domain/entities";

export interface CreateOrganizationResponse {
  id: string,
  name: string,
  slug: string,
  role: RoleName,
  permissions: Set<PermissionKey>
  createdAt: Date;
}
