import { Entity } from "@domain/interfaces";

export type RoleName =
  | 'SUPER_ADMIN'  // 'Platform-level administrator'
  | 'ORG_OWNER'    // 'Organization owner: full control, including delete org'
  | 'ORG_ADMIN'    // 'Organization administrator: manage org settings & users'
  | 'ORG_ADMIN'    // 'Organization administrator: manage org settings & users'
  | 'ORG_OPERATOR' // 'Organization operator: manage devices and act on behalf of org'
  | 'ORG_VIEWER'   // 'Organization viewer: read-only access'

export class Role extends Entity<Role, string> {
  declare name: RoleName;
  declare description: string;
  declare isGlobal: boolean;
  declare createdAt: Date;
}
