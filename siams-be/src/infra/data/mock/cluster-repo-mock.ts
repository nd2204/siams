import { Cluster } from "@domain/entities";
import { IClusterRepository } from "@domain/repositories";
import { MockRepoBase } from "./repo-mock-base";

export class ClusterRepositoryMock
  extends MockRepoBase<Cluster>
  implements IClusterRepository {

  constructor() { super() }

  updateClusterArea(clusterId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
