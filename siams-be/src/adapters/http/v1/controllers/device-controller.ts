import { GetAllActuatorsRequest } from "@feature/device/dtos/get-all-actuators-request"
import { GetAllActuatorsResponse } from "@feature/device/dtos/get-all-actuators-response"
import { GetAllCommandsResponse } from "@feature/device/dtos/get-all-commands-response"
import { GetAllSensorsRequest } from "@feature/device/dtos/get-all-sensors-request"
import { GetAllSensorsResponse } from "@feature/device/dtos/get-all-sensors-response"
import { GetDeviceByIdRequest } from "@feature/device/dtos/get-device-by-id-request"
import { GetDeviceByIdResponse } from "@feature/device/dtos/get-device-by-id-response"
import { ListTelemetryRequest } from "@feature/device/dtos/list-telemetry-request"
import { ListTelemetryResponse } from "@feature/device/dtos/list-telemetry-response"
import { GetAllActuatorsUC } from "@feature/device/get-all-actuators"
import { GetAllCommandsUC } from "@feature/device/get-all-commands"
import { GetAllSensorsUC } from "@feature/device/get-all-sensors"
import { GetDeviceByIdUC } from "@feature/device/get-by-id"
import { ListTelemetryUC } from "@feature/device/list-telemetry"
import { IRequest } from "@shared/interfaces"

export class DeviceController {
  constructor(
    private readonly getByIdUC: GetDeviceByIdUC,
    private readonly getAllSensorsUC: GetAllSensorsUC,
    private readonly getAllActuatorsUC: GetAllActuatorsUC,
    private readonly getAllCommandsUC: GetAllCommandsUC,
    private readonly listTelemetryUC: ListTelemetryUC
  ) { }

  async getById(req: IRequest): Promise<GetDeviceByIdResponse> {
    const request: GetDeviceByIdRequest = {
      token: req.token,
      deviceId: req.params?.id as string
    }
    return await this.getByIdUC.call(request)
  }

  async listTelemetry(req: IRequest): Promise<ListTelemetryResponse> {
    const request: ListTelemetryRequest = {
      token: req.token,
      deviceId: req.params?.id as string,
      sensorId: req.params?.sensorId as string,
      from: req.body?.page,
      to: req.body?.perPage,
      groupBy: req.body?.groupBy
    }
    return await this.listTelemetryUC.call(request)
  }

  async getAllSensors(req: IRequest): Promise<GetAllSensorsResponse> {
    const request: GetAllSensorsRequest = {
      token: req.token,
      deviceId: req.params?.id as string
    }
    return await this.getAllSensorsUC.call(request)
  }

  async getAllActuators(req: IRequest): Promise<GetAllActuatorsResponse> {
    const request: GetAllActuatorsRequest = {
      token: req.token,
      deviceId: req.params?.id as string
    }
    return await this.getAllActuatorsUC.call(request)
  }

  async getAllCommands(req: IRequest): Promise<GetAllCommandsResponse> {
    const request: GetAllActuatorsRequest = {
      token: req.token,
      deviceId: req.params?.id as string
    }
    return await this.getAllCommandsUC.call(request)
  }
}
