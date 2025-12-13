import { Entity } from "@domain/interfaces";

export const PermissionKeyConstants = {
  ReadOrg: 'org:read',             // 'Read organization metadata'),
  WriteOrg: 'org:write',           // 'Modify organization metadata'),
  DeleteOrg: 'org:delete',         // 'Delete organization'),
  InviteUser: 'user:invite',       // 'Invite user to organization'),
  ReadDevice: 'device:read',       // 'Read device'),
  DeleteDevice: 'device:delete',   // 'Delete device'),
  IssueCommand: 'command:issue',   // 'Issue commands to devices'),
  ReadTelemetry: 'telemetry:read', // 'Read telemetry data')
} as const

export type PermissionKey = typeof PermissionKeyConstants[keyof typeof PermissionKeyConstants]

export class Permission extends Entity<Permission, string> {
  declare key: PermissionKey;
  declare description: string;
  declare createdAt?: Date;
}
