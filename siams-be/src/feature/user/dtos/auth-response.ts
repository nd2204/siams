export type PermissionKey =
  | 'org:read'
  | 'org:write'
  | 'org:delete'
  | 'user:invite'
  | 'device:read'
  | 'device:delete'
  | 'command:issue'
  | 'telemetry:read'

export class AuthResponse {
  user!: {
    id: string,
    name: string,
    email: string,
    organizations?: {
      id: string,
      role: string,
      permissions: PermissionKey[]
    }[]
  }
  token!: string
}
