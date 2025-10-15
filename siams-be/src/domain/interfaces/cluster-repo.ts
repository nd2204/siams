import { IRepository } from "@/shared/interfaces";
import { Cluster } from "../entities/cluster";

export interface IClusterRepository extends IRepository<Cluster> {
  addDevice(deviceId: string, clusterId: string): Promise<boolean>
  removeDevice(deviceId: string, clusterId: string): Promise<boolean>
}
