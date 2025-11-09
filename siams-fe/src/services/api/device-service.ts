import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { DeviceDTO } from "./dtos/device/device-dto";
import type { IPaginated } from "@/types/paginated";
import type { DeviceStatus, DeviceTelemetry, Sensor } from "@/types/device";

export const deviceService = {
  async getAll(): Promise<DeviceDTO[]> {
    return apiClient.get<DeviceDTO[]>(ENDPOINTS.DEVICE.ROOT);
  },

  async getById(id: string): Promise<DeviceDTO> {
    return apiClient.get<DeviceDTO>(ENDPOINTS.DEVICE.BY_ID(id));
  },

  async listByClusterId(clusterId: string, page?: number, perPage?: number): Promise<IPaginated<DeviceDTO>> {
    return apiClient.post<IPaginated<DeviceDTO>>(ENDPOINTS.CLUSTER.LIST_DEVICES(clusterId), { page, perPage });
  },

  async listByOrgId(orgId: string, page?: number, perPage?: number): Promise<IPaginated<DeviceDTO>> {
    return apiClient.post<IPaginated<DeviceDTO>>(ENDPOINTS.ORG.LIST_DEVICES(orgId), { page, perPage });
  },

  async listSensors(id: string): Promise<Sensor[]> {
    return apiClient.get<Sensor>(ENDPOINTS.DEVICE.SENSORS(id))
  },

  async listActuator() {

  },

  async getTelemetry(id: string): Promise<IPaginated<DeviceTelemetry>> {
    return apiClient.get<IPaginated<DeviceTelemetry>>(ENDPOINTS.DEVICE.TELEMETRY(id))
  },

  async getStatus(id: string): Promise<IPaginated<DeviceStatus>> {
    return apiClient.get<IPaginated<DeviceStatus>>(ENDPOINTS.DEVICE.STATUS(id))
  }
};
