import { topics } from "@config/mqtt-topics";
import { IMqttHandler, IMqttClient } from "@domain/interfaces";
import { DeviceCommandAckUC } from "@feature/device/command/command-ack";
import { SignedDevicePayload } from "@feature/device/dtos";
import { IError, ILogger } from "@shared/interfaces";

type Params = {
  deviceId: string;
  orgId: string;
};

export class DeviceCommandAckHandler implements IMqttHandler<SignedDevicePayload, Params> {
  pattern = topics.deviceCommandAck.pattern
  topic = topics.deviceCommandAck.topic;

  constructor(
    private readonly useCase: DeviceCommandAckUC,
    private readonly logger: ILogger
  ) { }

  async handle(_: IMqttClient, params: Params, payload: SignedDevicePayload): Promise<void> {
    const deviceId = params.deviceId;

    try {
      // Call use-case with parsed payload from wrapper
      await this.useCase.call({ device_id: deviceId, payload });
    } catch (error: unknown) {
      const err = error as IError
      this.logger.info({ msg: `Encountered an error when handling for ${params.deviceId}`, obj: error })
    }
  }
}
