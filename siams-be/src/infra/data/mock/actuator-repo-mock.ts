import { DeviceActuator } from "@domain/entities";
import { IDeviceActuatorRepository } from "@domain/repositories";
import { MockRepoBase } from "./repo-mock-base";

export class ActuatorRepositoryMock
  extends MockRepoBase<DeviceActuator>
  implements IDeviceActuatorRepository {

  constructor() { super() }

  upsert(payload: Partial<DeviceActuator>): Promise<DeviceActuator> {
    return super.upsert(payload, ["local_id", "device_id"]);
  }
}
