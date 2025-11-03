import { Entity } from "@domain/interfaces";

export class DeviceStatus extends Entity<DeviceStatus, number> {
  declare deviceId: string
  declare cpuUsage?: number
  declare memoryUsage?: number
  declare wifiStrength?: number
  declare reportedAt?: number
}
