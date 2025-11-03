export type Role =
  | "SUPER_ADMIN"
  | "ORG_OWNER"
  | "ORG_ADMIN"
  | "ORG_OPERATOR"
  | "ORG_VIEWER"

export type PermissionKey =
  | 'org:read'
  | 'org:write'
  | 'org:delete'
  | 'user:invite'
  | 'device:read'
  | 'device:delete'
  | 'command:issue'
  | 'telemetry:read'
