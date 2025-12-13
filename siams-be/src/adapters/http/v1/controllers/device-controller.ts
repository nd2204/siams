import * as DeviceFeature from "@feature/device"
import * as DeviceDTOs from '@feature/device/dtos'
import { IRequest } from "@shared/interfaces"

export class DeviceController {
  constructor(
    private readonly getByIdUC: DeviceFeature.GetDeviceByIdUC,
    private readonly getAllSensorsUC: DeviceFeature.GetAllSensorsUC,
    private readonly getAllActuatorsUC: DeviceFeature.GetAllActuatorsUC,
    private readonly getAllCommandsUC: DeviceFeature.GetAllCommandsUC,
    private readonly listTelemetryUC: DeviceFeature.ListTelemetryUC,
    private readonly deviceSendCommandUC: DeviceFeature.DeviceSendCommandUC,
    private readonly getLatestStatusUC: DeviceFeature.GetDeviceStatusUC,
    private readonly listRecentDeviceEventUC: DeviceFeature.ListRecentDeviceEventUC,
  ) { }

  async getById(req: IRequest): Promise<DeviceDTOs.GetDeviceByIdResponse> {
    const request: DeviceDTOs.GetDeviceByIdRequest = {
      token: req.token,
      deviceId: req.params?.id as string
    }
    return await this.getByIdUC.call(request)
  }

  async sendCommand(req: IRequest): Promise<DeviceDTOs.DeviceSendCommandResponse> {
    const request: DeviceDTOs.DeviceSendCommandRequest = {
      token: req.token,
      device_id: req.params?.id as string,
      payload: req.body?.payload
    }
    return await this.deviceSendCommandUC.call(request)
  }

  async listTelemetry(req: IRequest): Promise<DeviceDTOs.ListTelemetryResponse> {
    const request: DeviceDTOs.ListTelemetryRequest = {
      token: req.token,
      deviceId: req.params?.id as string,
      sensorId: req.params?.sensorId as string,
      from: req.body?.from,
      to: req.body?.to,
      groupBy: req.body?.groupBy
    }
    return await this.listTelemetryUC.call(request)
  }

  async getAllSensors(req: IRequest): Promise<DeviceDTOs.GetAllSensorsResponse> {
    const request: DeviceDTOs.GetAllSensorsRequest = {
      token: req.token,
      deviceId: req.params?.id as string
    }
    return await this.getAllSensorsUC.call(request)
  }

  async getAllActuators(req: IRequest): Promise<DeviceDTOs.GetAllActuatorsResponse> {
    const request: DeviceDTOs.GetAllActuatorsRequest = {
      token: req.token,
      deviceId: req.params?.id as string
    }
    return await this.getAllActuatorsUC.call(request)
  }

  async getAllCommands(req: IRequest): Promise<DeviceDTOs.GetAllCommandsResponse> {
    const request: DeviceDTOs.GetAllActuatorsRequest = {
      token: req.token,
      deviceId: req.params?.id as string
    }
    return await this.getAllCommandsUC.call(request)
  }

  async getLatestStatus(req: IRequest): Promise<DeviceDTOs.GetDeviceStatusResponse | null> {
    const request: DeviceDTOs.GetDeviceStatusRequest = {
      token: req.token,
      device_id: req.params?.id as string
    }
    return await this.getLatestStatusUC.call(request)
  }

  async listEvent(req: IRequest): Promise<DeviceDTOs.ListRecentDeviceEventResponse> {
    const request: DeviceDTOs.ListRecentDeviceEventRequest = {
      token: req.token,
      device_id: req.params?.id as string,
      perBucket: req.body.perBucket && Number(req.body.perBucket),
    }
    return await this.listRecentDeviceEventUC.call(request)
  }
}
