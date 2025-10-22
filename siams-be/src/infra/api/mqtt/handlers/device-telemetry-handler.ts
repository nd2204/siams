import { topics } from "@config/mqtt-topics";
import { IMqttHandler, IMqttClient } from "@domain/interfaces";
import { ReceiveDeviceTelemetryUC } from "@feature/telemetry/receive-device-telemetry";
import { DeviceTelemetryPayload } from "@feature/telemetry/dtos/device-telemetry-request";
import { ILogger } from "@shared/interfaces";

type DeviceParams = {
  deviceId: string;
  orgId: string;
  clusterId: string;
};

export class DeviceTelemetryHandler implements IMqttHandler<DeviceTelemetryPayload, DeviceParams> {
  pattern = topics.deviceTelemetry.pattern
  topic = topics.deviceTelemetry.topic;

  constructor(
    private readonly useCase: ReceiveDeviceTelemetryUC,
    private readonly logger: ILogger
  ) { }

  async handle(_client: IMqttClient, params: DeviceParams, payload: DeviceTelemetryPayload): Promise<void> {
    try {
      await this.useCase.call({
        deviceId: params.deviceId,
        payload,
      })
    } catch (error) {
      this.logger.info({ msg: `Encountered an error when handling for ${params.deviceId}`, obj: error })
    }
  }
}
