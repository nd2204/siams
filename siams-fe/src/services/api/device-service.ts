import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { IPaginated } from "@/types/paginated";
import type { Actuator, Command, Device, DeviceStatus, DeviceTelemetry, Sensor } from "@/types/device";
import type { DeviceSendCommandRequest } from "./dtos/device/device-send-command-request";
import type { DeviceSendCommandResponse } from "./dtos/device/device-send-command-response";
import type { ListTelemtryRequest } from "./dtos/device/list-telemetry-request";
import type { ListTelemtryResponse } from "./dtos/device/list-telemetry-response";

export const deviceService = {
  async getAll(): Promise<Device[]> {
    return apiClient.get<Device[]>(ENDPOINTS.DEVICE.ROOT);
  },

  async getById(id: string): Promise<Device> {
    return apiClient.get<Device>(ENDPOINTS.DEVICE.BY_ID(id));
  },

  async sendCommand(req: DeviceSendCommandRequest): Promise<DeviceSendCommandResponse> {
    return apiClient.post<DeviceSendCommandResponse>(ENDPOINTS.DEVICE.COMMANDS(req.deviceId), req)
  },

  async listCommands(id: string): Promise<Command[]> {
    return apiClient.get<Command[]>(ENDPOINTS.DEVICE.COMMANDS(id))
  },

  async listSensors(id: string): Promise<Sensor[]> {
    return apiClient.get<Sensor[]>(ENDPOINTS.DEVICE.SENSORS(id))
  },

  async listActuators(id: string): Promise<Actuator[]> {
    return apiClient.get<Actuator[]>(ENDPOINTS.DEVICE.ACTUATORS(id))
  },

  async getTelemetry(req: ListTelemtryRequest): Promise<ListTelemtryResponse> {
    return apiClient.post<ListTelemtryResponse>(ENDPOINTS.DEVICE.TELEMETRY(req.deviceId, req.sensorId), req.payload)
  },

  async getStatus(id: string): Promise<IPaginated<DeviceStatus>> {
    return apiClient.get<IPaginated<DeviceStatus>>(ENDPOINTS.DEVICE.STATUS(id))
  }
};
