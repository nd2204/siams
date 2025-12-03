import { Device } from "@/domain/entities";
import { IPaginated } from "@/shared/interfaces";
import { IDeviceRepository } from "@domain/repositories"
import { MockRepoBase } from "./repo-mock-base";

export class DeviceRepositoryMock
  extends MockRepoBase<Device>
  implements IDeviceRepository {

  constructor() { super() }
  listByOrg(orgId: string, page: number, perPage: number): Promise<IPaginated<Device>> {
    throw new Error("Method not implemented.");
  }
}
