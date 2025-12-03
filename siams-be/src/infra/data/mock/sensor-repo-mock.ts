import { DeviceSensor } from "@domain/entities";
import { IDeviceSensorRepository } from "@domain/repositories";
import { MockRepoBase } from "./repo-mock-base";

export class SensorRepositoryMock
  extends MockRepoBase<DeviceSensor>
  implements IDeviceSensorRepository {

  constructor() { super() }

  upsert(payload: Partial<DeviceSensor>): Promise<DeviceSensor> {
    throw new Error("Method not implemented.");
  }
}
