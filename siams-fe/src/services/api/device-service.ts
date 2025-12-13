import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type {
  Actuator,
  Command,
  Device,
  DeviceStatus,
  Sensor,
  DeviceSendCommandRequest,
  DeviceSendCommandResponse,
  ListTelemtryRequest,
  ListTelemtryResponse,
  ListDeviceEventRequest,
  ListDeviceEventResponse
} from "@/types/device/index";

export const deviceService = {
  async getAll(): Promise<Device[]> {
    return apiClient.get<Device[]>(ENDPOINTS.DEVICE.ROOT);
  },

  async getById(id: string): Promise<Device> {
    return apiClient.get<Device>(ENDPOINTS.DEVICE.BY_ID(id));
  },

  async sendCommand(req: DeviceSendCommandRequest): Promise<DeviceSendCommandResponse> {
    return apiClient.post<DeviceSendCommandResponse>(ENDPOINTS.DEVICE.COMMANDS(req.device_id), req)
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

  async listTelemetry(req: ListTelemtryRequest): Promise<ListTelemtryResponse> {
    return apiClient.post<ListTelemtryResponse>(ENDPOINTS.DEVICE.TELEMETRY(req.deviceId, req.sensorId), req.payload)
  },

  async getLatestStatus(id: string): Promise<DeviceStatus> {
    return apiClient.get<DeviceStatus>(ENDPOINTS.DEVICE.STATUS(id))
  },

  async listEvent(req: ListDeviceEventRequest): Promise<ListDeviceEventResponse> {
    return apiClient.post<ListDeviceEventResponse>(ENDPOINTS.DEVICE.EVENTS(req.device_id), { perBucket: req.perBucket })
  }
};
