import { IRepository } from "@/shared/interfaces";
import { Cluster } from "../entities/cluster";

export interface IClusterRepository extends IRepository<Cluster> {
  updateClusterArea(clusterId: string): Promise<void>;
}
