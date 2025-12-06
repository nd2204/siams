import { topics } from "@config/mqtt-topics";
import { IMqttHandler, IMqttClient } from "@domain/interfaces";
import { SignedDevicePayload } from "@feature/device/dtos";
import { RegisterDeviceUC } from "@feature/device/register-device";
import { IError, ILogger } from "@shared/interfaces";

type RegisterParams = {
  tempId: string;
  orgId: string;
  clusterId: string;
};

/**
 * MQTT handler for device registration with signed payload validation.
 * 
 * Integration pattern for other handlers:
 * 1. Inject signedPayloadValidator and handler-specific validator
 * 2. Call signedPayloadValidator.validate(payload) to extract and parse payload
 * 3. Handle validation errors
 * 4. Call use-case with validated and parsed payload
 */
export class DeviceRegisterHandler implements IMqttHandler<SignedDevicePayload, RegisterParams> {
  pattern = topics.deviceRegister.pattern
  topic = topics.deviceRegister.topic;

  constructor(
    private readonly useCase: RegisterDeviceUC,
    private readonly logger: ILogger
  ) { }

  async handle(client: IMqttClient, params: RegisterParams, payload: SignedDevicePayload): Promise<void> {
    const orgId = params.orgId;
    const tempId = params.tempId;

    const ackTopic = topics.deviceRegisterAck.create({
      orgId: params.orgId,
      tempId: tempId
    });

    try {
      // Call use-case with parsed payload from wrapper
      const res = await this.useCase.call({ orgId, payload });

      // Publish ACK
      await client.publish(ackTopic, res);

      this.logger.info({ msg: `Acked: ${tempId}` });
    } catch (error: unknown) {
      const err = error as IError
      await client.publish(ackTopic, {
        error: err.name,
        message: err.message,
        details: err.details,
      });
      this.logger.info({ msg: `Acked Error: ${tempId}` });
    }
  }
}
