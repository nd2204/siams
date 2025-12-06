import { IUseCase, IValidator } from "@shared/interfaces";
import { DeviceSendCommandRequest } from "./dtos/device-send-command-request";
import { DeviceSendCommandResponse } from "./dtos/device-send-command-response";
import { IDeviceCommandRepository } from "@domain/repositories";
import { NotFoundError, ValidationError } from "@shared/errors";
import { IOutboxRepository } from "@domain/repositories/outbox-repo";
import { topics } from "@config/mqtt-topics";
import { IAuthService } from "@domain/services/auth-service";
import { OutboxEntry } from "@domain/entities";
import { v4 } from "uuid";
import { OutboxTypeConstants } from "@domain/entities/outbox";

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
    const { device } = await this.authService.canAccessDevice(user.id, value.device_id!);

    // 3. find command
    const command = await this.commandRepo.findOneBy({
      local_id: value.payload!.localId,
      device_id: device.id
    })
    if (!command) {
      throw new NotFoundError(`Command with device_id=${device.id} local_id=${value.payload!.localId} not found`)
    }

    // 4. Add to Outbox
    await this.outboxRepo.create(new OutboxEntry({
      id: v4(),
      type: OutboxTypeConstants.SentDeviceCommand,
      status: "PENDING",
      payload: {
        topic: topics.deviceCommand.create({
          orgId: device.org_id,
          deviceId: device.id,
        }),
        data: value.payload
      },
    }));

    return { success: true, message: "Command pending" }
  }
}
