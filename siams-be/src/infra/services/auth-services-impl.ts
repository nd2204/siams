import { Cluster, Device, Organization } from "@domain/entities";
import { IClusterRepository, IDeviceRepository, IOrganizationRepository, IOrganizationUserRepository } from "@domain/repositories";
import { IAuthService } from "@domain/services/auth-service";
import { UserClaims } from "@feature/user/dtos/user-claims";
import { sm_info } from "@shared/logger";

export class AuthService implements IAuthService {
  constructor(
    private orgRepo: IOrganizationRepository,
    private orgUserRepo: IOrganizationUserRepository,
    private clusterRepo: IClusterRepository,
    private deviceRepo: IDeviceRepository,
    private verify: (token: string) => UserClaims
  ) { }

  verifyToken(token: string): UserClaims {
    return this.verify(token);
  }

  async canAccessDevice(userId: string, deviceId: string): Promise<{ device: Device, cluster: Cluster, org: Organization } | null> {
    const device = await this.deviceRepo.findOneBy({ id: deviceId });
    if (!device) return null

    const data = await this.canAccessCluster(userId, device.clusterId)
    if (data != null) {
      return { device, ...data }
    } else {
      return null;
    }
  }

  async canAccessCluster(userId: string, clusterId: string): Promise<{ cluster: Cluster, org: Organization } | null> {
    const cluster = await this.clusterRepo.findOneBy({ id: clusterId });
    if (!cluster) return null

    const org = await this.canAccessOrg(userId, cluster.orgId)
    if (org != null) {
      return { cluster, org }
    } else {
      return null;
    }
  }

  async canAccessOrg(userId: string, orgId: string): Promise<Organization | null> {
    const orgUser = await this.orgUserRepo.findOneBy({ userId, orgId: orgId });
    if (!orgUser) return null;

    return await this.orgRepo.findOneBy({ id: orgUser.orgId }) ?? null;
  }
}
