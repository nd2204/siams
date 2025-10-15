import { Cluster } from "@domain/entities";
import { IClusterRepository } from "@domain/interfaces";
import { NotFoundError, ValidationError } from "@shared/errors";
import { IUseCase } from "@shared/interfaces";

export class GetClusterByIdUC implements IUseCase<Cluster> {
  constructor(
    private clusterRepo: IClusterRepository,
  ) { }

  async call(id?: string): Promise<Cluster> {
    if (!id) {
      throw new ValidationError("The cluster's id is required")
    }

    const result = await this.clusterRepo.findOneBy({ id });
    if (!result) {
      throw new NotFoundError(`Cannot find cluster with id=${id}`)
    }

    return result
  }
}
