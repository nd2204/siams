import { Cluster } from "@domain/entities";
import { IClusterRepository } from "@domain/repositories";
import { IPaginated, IUseCase } from "@shared/interfaces";

export class ListClusterUC implements IUseCase<IPaginated<Cluster>> {
  constructor(
    private clusterRepo: IClusterRepository
  ) { }

  async call(page?: number, perPage?: number): Promise<IPaginated<Cluster>> {
    return this.clusterRepo.listBy({}, page ?? 0, perPage ?? Number.MAX_VALUE)
  }
}
