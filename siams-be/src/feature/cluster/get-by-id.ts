import { IClusterRepository, IDeviceRepository, IOrganizationUserRepository } from "@domain/repositories";
import { ClusterDTO } from "@feature/cluster/dtos/cluster-dto";
import { GetClusterByIdRequest } from "@feature/cluster/dtos/get-cluster-by-id-request";
import { AuthResponse } from "@feature/user/dtos/auth-response";
import { NotFoundError, UnauthorizedError, ValidationError } from "@shared/errors";
import { IUseCase, IValidator } from "@shared/interfaces";

export class GetClusterByIdUC implements IUseCase<ClusterDTO> {
  constructor(
    private clusterRepo: IClusterRepository,
    private orgUserRepo: IOrganizationUserRepository,
    private deviceRepo: IDeviceRepository,
    private validator: IValidator<GetClusterByIdRequest>,
    private verifyToken: (token: string) => AuthResponse["user"]
  ) { }

  async call(req: GetClusterByIdRequest): Promise<ClusterDTO> {
    const { value, errors } = this.validator.validate(req);
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    const cluster = await this.clusterRepo.findOneBy({ id: value.clusterId! })
    if (!cluster) {
      throw new NotFoundError("Cluster not found")
    }

    const user = this.verifyToken(value.token!)
    const existingOrgUser = await this.orgUserRepo.findOneBy({ userId: user.id, orgId: cluster.orgId });
    if (!existingOrgUser) {
      throw new UnauthorizedError(`Organization not exists or user does not belong to this organization`)
    }

    const devices = await this.deviceRepo.listBy({ clusterId: cluster.id }, 1, 10);

    const result: ClusterDTO = {
      ...cluster,
      devices: devices
    }

    return result;
  }
}
