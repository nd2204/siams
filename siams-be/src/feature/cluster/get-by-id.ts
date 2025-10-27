import { Cluster } from "@domain/entities";
import { IClusterRepository } from "@domain/repositories";
import { NotFoundError, UnauthorizedError, ValidationError } from "@shared/errors";
import { IUseCase } from "@shared/interfaces";
import { GetClusterByIdRequest } from "./dtos/get-cluster-by-id-request";

export class GetClusterByIdUC implements IUseCase<Cluster> {
  constructor(
    private clusterRepo: IClusterRepository,
  ) { }

  async call(req: GetClusterByIdRequest): Promise<Cluster> {
    // if (!req.token) {
    //   throw new UnauthorizedError("You are not authorized to do this action")
    // }

    if (!req.clusterId) {
      throw new ValidationError("The cluster's id is required")
    }

    const result = await this.clusterRepo.findOneBy({ id: req.clusterId });
    if (!result) {
      throw new NotFoundError(`Cannot find cluster with id=${req.clusterId}`)
    }

    return result
  }
}
