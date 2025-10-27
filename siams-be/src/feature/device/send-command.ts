import { IUseCase } from "@shared/interfaces";
import { DeviceSendCommandRequest } from "./dtos/device-send-command-request";
import { DeviceSendCommandResponse } from "./dtos/device-send-command-response";
import { IDeviceCapabilitiesRepository } from "@domain/repositories";

export class DeviceSendCommandUC implements IUseCase<DeviceSendCommandResponse> {
  constructor(
    private readonly deviceCapabilitiesRepo: IDeviceCapabilitiesRepository,
  ) { }

  async call(req: DeviceSendCommandRequest): Promise<DeviceSendCommandResponse> {
    throw new Error("Method not implemented.");
  }
}
