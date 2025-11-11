import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { DeviceDTO } from "./dtos/device/device-dto";
import type { IPaginated } from "@/types/paginated";
import type { Actuator, Device, DeviceStatus, DeviceTelemetry, Sensor } from "@/types/device";

export const deviceService = {
  async getAll(): Promise<Device[]> {
    return apiClient.get<Device[]>(ENDPOINTS.DEVICE.ROOT);
  },

  async getById(id: string): Promise<DeviceDTO> {
    return apiClient.get<Device>(ENDPOINTS.DEVICE.BY_ID(id));
  },

  async listSensors(id: string): Promise<Sensor[]> {
    return apiClient.get<Sensor[]>(ENDPOINTS.DEVICE.SENSORS(id))
  },

  async listActuator(id: string): Promise<Actuator[]> {
    return apiClient.get<Actuator[]>(ENDPOINTS.DEVICE.ACTUATORS(id))
  },

  async getTelemetry(id: string): Promise<IPaginated<DeviceTelemetry>> {
    return apiClient.get<IPaginated<DeviceTelemetry>>(ENDPOINTS.DEVICE.TELEMETRY(id))
  },

  async getStatus(id: string): Promise<IPaginated<DeviceStatus>> {
    return apiClient.get<IPaginated<DeviceStatus>>(ENDPOINTS.DEVICE.STATUS(id))
  }
};
