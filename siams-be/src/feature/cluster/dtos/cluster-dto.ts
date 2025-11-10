import { DeviceDTO } from "@feature/device/dtos/device-dto"
import { IPaginated } from "@shared/interfaces"

export interface ClusterDTO {
  id: string,
  name: string,
  loc_name?: string,
  orgId: string,
  geom?: object,
  devices?: IPaginated<DeviceDTO>,
  description?: string,
  createdAt?: Date
}
