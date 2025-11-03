
import { Device } from "@domain/entities";
import { IClusterRepository, IDeviceRepository, IOrganizationUserRepository } from "@domain/repositories";
import { IPaginated, IUseCase, IValidator } from "@shared/interfaces";
import { ListDeviceByClusterIdRequest } from "./dtos/list-devices-by-cluster-id-request";
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
    const foundCluster = await this.clusterRepo.findOneBy({ id: value.clusterId })
    if (!foundCluster) {
      throw new NotFoundError("Cluster not found")
    }
    //
    // const foundUserByOrg = foundCluster?.orgId ? await this.orgUserRepo.findOneBy({ userId: auth.id, orgId: value.orgId }) : null
    // if (!foundUserByOrg) {
    //   throw new UnauthorizedError()
    // }

    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    return await this.deviceRepo.listBy(
      { clusterId: foundCluster.id! },
      value.page ?? 1,
      value.perPage ?? 10
    )
  }
}
