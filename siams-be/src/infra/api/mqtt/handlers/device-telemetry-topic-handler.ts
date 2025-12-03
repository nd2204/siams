import { topics } from "@config/mqtt-topics";
import { IMqttHandler, IMqttClient } from "@domain/interfaces";
import { ReceiveDeviceTelemetryUC } from "@feature/device/telemetry/receive-device-telemetry";
import { ILogger } from "@shared/interfaces";
import { SignedDevicePayload } from "@feature/device/dtos";

type DeviceParams = {
  deviceId: string;
  orgId: string;
};

export class DeviceTelemetryHandler implements IMqttHandler<SignedDevicePayload, DeviceParams> {
  pattern = topics.deviceTelemetry.pattern
  topic = topics.deviceTelemetry.topic;

  constructor(
    private readonly useCase: ReceiveDeviceTelemetryUC,
    private readonly logger: ILogger
  ) { }

  async handle(_client: IMqttClient, params: DeviceParams, payload: SignedDevicePayload): Promise<void> {
    // this.logger.info({ msg: `Rx [${params.deviceId}]: (${payload.ts}) ${payload.value}` })

    try {
      await this.useCase.call({
        deviceId: params.deviceId,
        orgId: params.orgId,
        payload,
      })

    } catch (error) {
      this.logger.info({ msg: `Encountered an error when handling for ${params.deviceId}`, obj: error })
    }
  }
}
