import { ClusterNotFoundError } from "@domain/errors";
import { IClusterRepository, IOrganizationUserRepository } from "@domain/repositories";
import { ClusterDTO } from "@feature/cluster/dtos/cluster-dto";
import { GetClusterByIdRequest } from "@feature/cluster/dtos/get-cluster-by-id-request";
import { AuthResponse } from "@feature/user/dtos/auth-response";
import { UnauthorizedError, ValidationError } from "@shared/errors";
import { IUseCase, IValidator } from "@shared/interfaces";

export class GetClusterByIdUC implements IUseCase<ClusterDTO> {
  constructor(
    private clusterRepo: IClusterRepository,
    private orgUserRepo: IOrganizationUserRepository,
    private validator: IValidator<GetClusterByIdRequest>,
    private verifyToken: (token: string) => AuthResponse["user"]
  ) { }

  async call(req: GetClusterByIdRequest): Promise<ClusterDTO> {
    const { value: r, errors } = this.validator.validate(req);
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    const cluster = await this.clusterRepo.findOneBy({ id: r.clusterId! })
    if (!cluster) {
      throw new ClusterNotFoundError(r.clusterId!)
    }

    const user = this.verifyToken(r.token!)
    const existingOrgUser = await this.orgUserRepo.findOneBy({ userId: user.id, orgId: cluster.orgId });
    if (!existingOrgUser) {
      throw new UnauthorizedError(`Organization not exists or user does not belong to this organization`)
    }

    const result: ClusterDTO = {
      ...cluster,
    }

    return result;
  }
}
