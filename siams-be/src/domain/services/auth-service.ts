import { Cluster, Device, Organization, PermissionKey } from "@domain/entities";
import { UserId } from "@domain/entities/user";
import { UserClaims } from "@feature/user/dtos/user-claims";

export interface IAuthService {
  verifyToken(token: string): UserClaims
  canAccessDevice(userId: string, deviceId: string): Promise<{ device: Device, org: Organization }>
  canAccessCluster(userId: string, clusterId: string): Promise<{ cluster: Cluster, org: Organization }>
  canAccessOrg(userId: string, orgId: string): Promise<Organization>
  hasPermissions(user_id: UserId, perms: PermissionKey[]): Promise<boolean>;
}
