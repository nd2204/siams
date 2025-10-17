import { IClusterRepository } from "@domain/repositories";
import { ValidationError } from "@shared/errors";
import { IUseCase } from "@shared/interfaces";

export class ClusterAddDeviceUC implements IUseCase<boolean> {
  constructor(
    private clusterRepo: IClusterRepository
  ) { }

  async call(deviceId?: string, clusterId?: string): Promise<boolean> {
    if (!deviceId || !clusterId) {
      throw new ValidationError("Missing device or(and) cluster id")
    }

    return this.clusterRepo.addDevice(deviceId, clusterId);
  }
}
