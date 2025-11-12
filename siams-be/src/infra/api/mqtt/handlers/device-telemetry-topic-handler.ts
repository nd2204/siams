import { topics } from "@config/mqtt-topics";
import { IMqttHandler, IMqttClient } from "@domain/interfaces";
import { ReceiveDeviceTelemetryUC } from "@feature/telemetry/receive-device-telemetry";
import { DeviceTelemetryPayload } from "@feature/telemetry/dtos/device-telemetry-request";
import { ILogger } from "@shared/interfaces";
import { IEventBus } from "@domain/interfaces/events";
import { DeviceTelemetryReceivedEvent } from "@domain/events/device-telemetry-received-event";
import { TelemetryGroupDto } from "@feature/device/dtos/telemtry-dto";

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
    private readonly eventBus: IEventBus,
    private readonly logger: ILogger
  ) { }

  async handle(_client: IMqttClient, params: DeviceParams, payload: DeviceTelemetryPayload): Promise<void> {
    // this.logger.info({ msg: `Rx [${params.deviceId}]: (${payload.ts}) ${payload.value}` })

    try {
      const telemetry = await this.useCase.call({
        deviceId: params.deviceId,
        payload,
      })

      const telemetryGroup: TelemetryGroupDto = {
        bucket: telemetry.timestamp.toISOString(),
        sensorId: telemetry.sensorId,
        avgValue: telemetry.value,
        minValue: telemetry.value,
        maxValue: telemetry.value,
        count: 1
      }

      await this.eventBus.publish(new DeviceTelemetryReceivedEvent(
        params.orgId,
        params.clusterId,
        params.deviceId,
        telemetryGroup
      ));

    } catch (error) {
      this.logger.info({ msg: `Encountered an error when handling for ${params.deviceId}`, obj: error })
    }
  }
}
