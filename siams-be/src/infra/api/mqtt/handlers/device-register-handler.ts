
import { topics } from "@config/mqtt-topics";
import { IMqttHandler, IMqttClient } from "@domain/interfaces";
import { RegisterDevicePayload } from "@feature/device/dtos/register-device-request";
import { RegisterDeviceUC } from "@feature/device/register-device";
import { IError, ILogger } from "@shared/interfaces";

type RegisterParams = {
  tempId: string;
  orgId: string;
  clusterId: string;
};

export class DeviceRegisterHandler implements IMqttHandler<RegisterDevicePayload, RegisterParams> {
  pattern = topics.deviceRegister.pattern
  topic = topics.deviceRegister.topic;

  constructor(
    private readonly useCase: RegisterDeviceUC,
    private readonly logger: ILogger
  ) { }

  async handle(client: IMqttClient, params: RegisterParams, payload: RegisterDevicePayload): Promise<void> {
    const orgId = params.orgId;
    const clusterId = params.clusterId;
    const tempId = params.tempId;

    this.logger.info({ msg: `Received from ${tempId}` });

    const ackTopic = topics.deviceRegisterAck.create({
      orgId: params.orgId,
      clusterId: params.clusterId,
      tempId: tempId
    });

    try {
      // xử lý usecase
      const res = await this.useCase.call({ orgId, clusterId, payload });
      // publish ACK
      await client.publish(ackTopic, res);
    } catch (error: unknown) {
      const err = error as IError
      await client.publish(ackTopic, {
        error: err.name,
        message: err.message,
        details: err.details,
      });
    }

    this.logger.info({ msg: `Acked: ${tempId}` });
  }
}
