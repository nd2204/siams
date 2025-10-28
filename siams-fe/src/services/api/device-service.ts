import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { DeviceDTO } from "./dtos/device/device-dto";
import type { IPaginated } from "@/types/paginated";

export const deviceService = {
  async getAll(): Promise<DeviceDTO[]> {
    return apiClient.get<DeviceDTO[]>(ENDPOINTS.DEVICE.ROOT);
  },

  async getById(id: string): Promise<DeviceDTO> {
    return apiClient.get<DeviceDTO>(ENDPOINTS.DEVICE.BY_ID(id));
  },

  async listByClusterId(clusterId: string, page?: number, perPage?: number): Promise<IPaginated<DeviceDTO>> {
    return apiClient.post<IPaginated<DeviceDTO>>(ENDPOINTS.DEVICE.LIST_BY_CLUSTER_ID(clusterId), { page, perPage });
  },
};
