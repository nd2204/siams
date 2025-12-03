import { Cluster, Device, Organization } from "@domain/entities";
import { UserClaims } from "@feature/user/dtos/user-claims";

export interface IAuthService {
  verifyToken(token: string): UserClaims
  canAccessDevice(userId: string, deviceId: string): Promise<{ device: Device, org: Organization }>
  canAccessCluster(userId: string, clusterId: string): Promise<{ cluster: Cluster, org: Organization }>
  canAccessOrg(userId: string, orgId: string): Promise<Organization>
}
