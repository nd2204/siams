import { IPaginated, IRepository } from "@/shared/interfaces";
import { type Device } from "@domain/entities";

export interface IDeviceRepository extends IRepository<Device> {
  listByOrg(orgId: string, page: number, perPage: number): Promise<IPaginated<Device>>;
}
