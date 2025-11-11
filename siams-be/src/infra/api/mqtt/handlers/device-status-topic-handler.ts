import { topics } from "@config/mqtt-topics";
import { IMqttHandler, IMqttClient } from "@domain/interfaces";
import { DeviceStatusPayload } from "@feature/telemetry/dtos/device-status-request";
import { ReceiveDeviceStatusUC } from "@feature/telemetry/receive-device-status";
import { ILogger } from "@shared/interfaces";

type DeviceParams = {
  deviceId: string;
  orgId: string;
  clusterId: string;
};

export class DeviceStatusHandler implements IMqttHandler<DeviceStatusPayload, DeviceParams> {
  topic = topics.deviceStatus.topic;
  pattern = topics.deviceStatus.pattern

  constructor(
    private readonly useCase: ReceiveDeviceStatusUC,
    private readonly logger: ILogger
  ) { }

  async handle(_client: IMqttClient, params: DeviceParams, payload: DeviceStatusPayload): Promise<void> {
    try {
      await this.useCase.call({
        deviceId: params.deviceId,
        payload
      })
    } catch (error) {
      this.logger.info({ msg: `Encountered an error when handling for ${params.deviceId}`, obj: error })
    }
  }
}
