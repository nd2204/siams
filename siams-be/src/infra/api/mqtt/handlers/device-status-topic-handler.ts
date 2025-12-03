import { topics } from "@config/mqtt-topics";
import { IMqttHandler, IMqttClient } from "@domain/interfaces";
import { SignedDevicePayload } from "@feature/device/dtos";
import { ReceiveDeviceStatusUC } from "@feature/device/status/receive-device-status";
import { ILogger } from "@shared/interfaces";

type DeviceParams = {
  deviceId: string;
  orgId: string;
  clusterId: string;
};

export class DeviceStatusHandler implements IMqttHandler<SignedDevicePayload, DeviceParams> {
  topic = topics.deviceStatus.topic;
  pattern = topics.deviceStatus.pattern

  constructor(
    private readonly useCase: ReceiveDeviceStatusUC,
    private readonly logger: ILogger
  ) { }

  async handle(_client: IMqttClient, params: DeviceParams, payload: SignedDevicePayload): Promise<void> {
    try {
      await this.useCase.call({
        deviceId: params.deviceId,
        orgId: params.orgId,
        payload
      })
    } catch (error) {
      this.logger.info({ msg: `Encountered an error when handling for ${params.deviceId}`, obj: error })
    }
  }
}
