import { Device } from "@domain/entities";
import { IClusterRepository, IDeviceRepository, IOrganizationUserRepository } from "@domain/repositories";
import { IPaginated, IUseCase, IValidator } from "@shared/interfaces";
import { ListDeviceByClusterIdRequest } from "./dtos/list-by-cluster-id-request";
import { UnauthorizedError, ValidationError } from "@shared/errors";
import { AuthResponse } from "@feature/user/dtos/auth-response";
import { ClusterNotFoundError } from "@domain/errors";

export class ListDeviceByClusterIdUC implements IUseCase<IPaginated<Device>> {
  constructor(
    private orgUserRepo: IOrganizationUserRepository,
    private clusterRepo: IClusterRepository,
    private deviceRepo: IDeviceRepository,
    private validator: IValidator<ListDeviceByClusterIdRequest>,
    private verifyToken: (token: string) => AuthResponse["user"]
  ) { }

  async call(req: ListDeviceByClusterIdRequest): Promise<IPaginated<Device>> {
    const { value: r, errors } = this.validator.validate(req);

    // const auth = this.verifyToken(value.token!)
    const cluster = await this.clusterRepo.findOneBy({ id: r.clusterId })
    if (!cluster) {
      throw new ClusterNotFoundError(r.clusterId!)
    }

    const user = this.verifyToken(r.token!);
    const orgUser = await this.orgUserRepo.findOneBy({ userId: user.id, orgId: cluster.orgId })
    if (!orgUser) {
      throw new UnauthorizedError("You are not authorized to do this action")
    }

    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    return await this.deviceRepo.listBy(
      { cluster_id: cluster.id! },
      r.page ?? 1,
      r.perPage ?? 10
    )
  }
}
