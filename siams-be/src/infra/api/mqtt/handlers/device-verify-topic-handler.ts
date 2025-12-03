import { topics } from "@config/mqtt-topics";
import { IMqttHandler, IMqttClient } from "@domain/interfaces";
import { VerifyDeviceUC } from "@feature/device/verify-device";
import { IError, ILogger } from "@shared/interfaces";
import { DeviceParams } from "./params";
import { SignedDevicePayload } from "@feature/device/dtos";

export class DeviceVerifyHandler implements IMqttHandler<SignedDevicePayload, DeviceParams> {
  pattern = topics.deviceVerify.pattern
  topic = topics.deviceVerify.topic;

  constructor(
    private readonly useCase: VerifyDeviceUC,
    private readonly logger: ILogger
  ) { }

  async handle(client: IMqttClient, params: DeviceParams, payload: SignedDevicePayload): Promise<void> {
    const ackTopic = topics.deviceVerifyAck.create({
      orgId: params.orgId,
      deviceId: params.deviceId
    });

    try {
      const result = await this.useCase.call({
        deviceId: params.deviceId,
        payload,
      })

      await client.publish(ackTopic, result);
    } catch (error: unknown) {
      const err = error as IError
      await client.publish(ackTopic, {
        error: err.name,
        message: err.message,
        details: err.details,
      });
    }

    this.logger.info({ msg: `Acked: ${params.deviceId}` });
  }
}
