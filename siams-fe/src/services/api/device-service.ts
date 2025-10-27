import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { DeviceDTO } from "./dtos/device/device-dto";

export const deviceService = {
  async getAll(): Promise<DeviceDTO[]> {
    return apiClient.get<DeviceDTO[]>(ENDPOINTS.DEVICE.ROOT);
  },

  async getById(id: string): Promise<DeviceDTO> {
    return apiClient.get<DeviceDTO>(ENDPOINTS.DEVICE.BY_ID(id));
  },
};
