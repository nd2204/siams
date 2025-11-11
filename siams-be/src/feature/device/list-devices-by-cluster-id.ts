
import { Device } from "@domain/entities";
import { IClusterRepository, IDeviceRepository, IOrganizationUserRepository } from "@domain/repositories";
import { IPaginated, IUseCase, IValidator } from "@shared/interfaces";
import { ListDeviceByClusterIdRequest } from "./dtos/list-by-cluster-id-request";
import { NotFoundError, UnauthorizedError, ValidationError } from "@shared/errors";
import { AuthResponse } from "@feature/user/dtos/auth-response";

export class ListDeviceByClusterIdUC implements IUseCase<IPaginated<Device>> {
  constructor(
    private orgUserRepo: IOrganizationUserRepository,
    private clusterRepo: IClusterRepository,
    private deviceRepo: IDeviceRepository,
    private validator: IValidator<ListDeviceByClusterIdRequest>,
    private verifyToken: (token: string) => AuthResponse["user"]
  ) { }

  async call(req: ListDeviceByClusterIdRequest): Promise<IPaginated<Device>> {
    const { value, errors } = this.validator.validate(req);

    // const auth = this.verifyToken(value.token!)
    const cluster = await this.clusterRepo.findOneBy({ id: value.clusterId })
    if (!cluster) {
      throw new NotFoundError("Cluster not found")
    }

    const user = this.verifyToken(value.token!);
    const orgUser = await this.orgUserRepo.findOneBy({ userId: user.id, orgId: cluster.orgId })
    if (!orgUser) {
      throw new UnauthorizedError("You are not authorized to do this action")
    }

    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    return await this.deviceRepo.listBy(
      { clusterId: cluster.id! },
      value.page ?? 1,
      value.perPage ?? 10
    )
  }
}
