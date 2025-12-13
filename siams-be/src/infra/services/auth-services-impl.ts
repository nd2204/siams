import { Cluster, Device, Organization, PermissionKey } from "@domain/entities";
import { UserId } from "@domain/entities/user";
import { ClusterNotFoundError, OrganizationNotFoundError, OrganizationUserNotFoundError } from "@domain/errors";
import { IClusterRepository, IDeviceRepository, IOrganizationRepository, IOrganizationUserRepository, IRoleRepository } from "@domain/repositories";
import { IAuthService } from "@domain/services/auth-service";
import { UserClaims } from "@feature/user/dtos/user-claims";
import { NotFoundError } from "@shared/errors";

export class AuthService implements IAuthService {
  constructor(
    private orgRepo: IOrganizationRepository,
    private orgUserRepo: IOrganizationUserRepository,
    private clusterRepo: IClusterRepository,
    private deviceRepo: IDeviceRepository,
    private roleRepo: IRoleRepository,
    private verify: (token: string) => UserClaims
  ) { }

  async hasPermissions(user_id: UserId, perms: PermissionKey[]): Promise<boolean> {
    const map = await this.roleRepo.getRoleIdPermissionMap();
    const org_member = await this.orgUserRepo.findOneBy({ userId: user_id })
    if (!org_member) return false;

    for (let perm of perms) {
      if (!map[org_member?.roleId].permissions.has(perm)) {
        return false;
      }
    }

    return true;
  }

  verifyToken(token: string): UserClaims {
    return this.verify(token);
  }

  async canAccessDevice(userId: string, deviceId: string): Promise<{ device: Device, org: Organization }> {
    const device = await this.deviceRepo.findOneBy({ id: deviceId });
    if (!device) {
      throw new NotFoundError("Device with id=${deviceId} not found");
    }

    const org = await this.canAccessOrg(userId, device.org_id)
    return { device, org }
  }

  async canAccessCluster(userId: string, clusterId: string): Promise<{ cluster: Cluster, org: Organization }> {
    const cluster = await this.clusterRepo.findOneBy({ id: clusterId });
    if (!cluster) throw new ClusterNotFoundError(clusterId)

    const org = await this.canAccessOrg(userId, cluster.orgId)
    return { cluster, org }
  }

  async canAccessOrg(userId: string, orgId: string): Promise<Organization> {
    const org = await this.orgRepo.findOneBy({ id: orgId });
    if (!org) {
      throw new OrganizationNotFoundError(orgId);
    }

    const orgUser = await this.orgUserRepo.findOneBy({ userId, orgId: orgId });
    if (!orgUser) {
      throw new OrganizationUserNotFoundError(userId, orgId);
    }

    return org
  }
}
