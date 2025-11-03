import { Entity } from "@domain/interfaces";

export type PermissionKey =
  | 'org:read'       // 'Read organization metadata'),
  | 'org:write'      // 'Modify organization metadata'),
  | 'org:delete'     // 'Delete organization'),
  | 'user:invite'    // 'Invite user to organization'),
  | 'device:read'    // 'Read device'),
  | 'device:delete'  // 'Delete device'),
  | 'command:issue'  // 'Issue commands to devices'),
  | 'telemetry:read' // 'Read telemetry data')

export class Permission extends Entity<Permission, string> {
  declare key: PermissionKey;
  declare description: string;
  declare createdAt?: Date;
}
