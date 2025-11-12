import { IUseCase, IValidator } from "@shared/interfaces";
import { DeviceSendCommandRequest } from "./dtos/device-send-command-request";
import { DeviceSendCommandResponse } from "./dtos/device-send-command-response";
import { IDeviceCommandRepository } from "@domain/repositories";
import { NotFoundError, UnauthorizedError, ValidationError } from "@shared/errors";
import { IOutboxRepository } from "@domain/repositories/outbox-repo";
import { topics } from "@config/mqtt-topics";
import { IAuthService } from "@domain/services/auth-service";
import { OutboxEntry } from "@domain/entities";
import { v4 } from "uuid";

export class DeviceSendCommandUC implements IUseCase<DeviceSendCommandResponse> {
  constructor(
    private readonly commandRepo: IDeviceCommandRepository,
    private readonly validator: IValidator<DeviceSendCommandRequest>,
    private readonly outboxRepo: IOutboxRepository,
    private readonly authService: IAuthService
  ) { }

  async call(req: DeviceSendCommandRequest): Promise<DeviceSendCommandResponse> {
    // 1. validate request
    const { value, errors } = this.validator.validate(req);
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid command request", errors);
    }

    // 2. check user permission
    const user = this.authService.verifyToken(value.token!);
    const data = await this.authService.canAccessDevice(user.id, value.deviceId!);
    if (!data) {
      throw new UnauthorizedError()
    }

    // 3. find command
    const command = await this.commandRepo.findOneBy({
      localId: value.payload!.localId,
      deviceId: data.device.id
    })
    if (!command) {
      throw new NotFoundError(`Command with deviceId=${data.device.id} id=${value.deviceId} not found`)
    }

    // 4. Add to Outbox
    await this.outboxRepo.create(new OutboxEntry({
      id: v4(),
      aggregateType: "device.command",
      aggregateId: command.id,
      status: "PENDING",
      topic: topics.deviceCommand.create({
        orgId: data.org.id,
        clusterId: data.device.clusterId,
        deviceId: data.device.id,
      }),
      payload: value.payload,
    }));

    return { success: true, message: "Command pending" }
  }
}
