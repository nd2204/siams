import { Cluster } from "@domain/entities";
import { IClusterRepository } from "@domain/repositories";
import { IPaginated, IUseCase, IValidator } from "@shared/interfaces";
import { ListClusterByOrgIdRequest } from "./dtos/list-cluster-by-org-id-request";
import { ValidationError } from "@shared/errors";

export class ListClusterByOrgIdUC implements IUseCase<IPaginated<Cluster>> {
  constructor(
    private clusterRepo: IClusterRepository,
    private validator: IValidator<ListClusterByOrgIdRequest>
  ) { }

  async call(req: ListClusterByOrgIdRequest): Promise<IPaginated<Cluster>> {
    const { value, errors } = this.validator.validate(req);

    /* TODO: add auth verification from token */

    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    return await this.clusterRepo.listBy(
      { orgId: value.orgId! },
      value.page ?? 1,
      value.perPage ?? 10
    )
  }
}
