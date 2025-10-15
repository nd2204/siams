import { Cluster } from "@domain/entities";
import { IClusterRepository } from "@domain/interfaces";
import { IUseCase } from "@shared/interfaces";

export class QueryClusterUC implements IUseCase<Cluster[]> {
  constructor(
    private clusterRepo: IClusterRepository
  ) { }

  async call(filter: Partial<Cluster>): Promise<Cluster[]> {
    return this.clusterRepo.findAllBy(filter);
  }
}
