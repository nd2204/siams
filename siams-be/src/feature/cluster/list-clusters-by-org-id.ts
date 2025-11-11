import { IClusterRepository, IOrganizationUserRepository } from "@domain/repositories";
import { IUseCase, IValidator } from "@shared/interfaces";
import { ListClusterByOrgIdRequest } from "./dtos/list-cluster-by-org-id-request";
import { UnauthorizedError, ValidationError } from "@shared/errors";
import { AuthResponse } from "@feature/user/dtos/auth-response";
import { ListClusterByOrgIdResponse } from "./dtos/list-cluster-by-org-id-response";

export class ListClusterByOrgIdUC implements IUseCase<ListClusterByOrgIdResponse> {
  constructor(
    private clusterRepo: IClusterRepository,
    private orgUserRepo: IOrganizationUserRepository,
    private validator: IValidator<ListClusterByOrgIdRequest>,
    private verifyToken: (token: string) => AuthResponse["user"]
  ) { }

  async call(req: ListClusterByOrgIdRequest): Promise<ListClusterByOrgIdResponse> {
    const { value, errors } = this.validator.validate(req);

    /* TODO: add auth verification from token */

    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    const user = this.verifyToken(value.token!)
    const existingOrgUser = await this.orgUserRepo.findOneBy({ userId: user.id, orgId: value.orgId! });
    if (!existingOrgUser) {
      throw new UnauthorizedError(`Organization not exists or user does not belong to this organization`)
    }

    const clusters = await this.clusterRepo.listBy(
      { orgId: existingOrgUser.orgId! },
      value.page ?? 1,
      value.perPage ?? 10
    )

    clusters.data.map((c) => {
      return c
    })

    return clusters;
  }
}
