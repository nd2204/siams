import { IUseCase, IValidator } from "@shared/interfaces";
import { DeviceSendCommandRequest } from "./dtos/device-send-command-request";
import { DeviceSendCommandResponse } from "./dtos/device-send-command-response";
import { IDeviceCommandRepository, IDeviceRepository } from "@domain/repositories";
import { AuthResponse } from "@feature/user/dtos/auth-response";
import { NotFoundError, ValidationError } from "@shared/errors";
import { IOutboxRepository } from "@domain/repositories/outbox-repo";
import { topics } from "@config/mqtt-topics";

export class DeviceSendCommandUC implements IUseCase<DeviceSendCommandResponse> {
  constructor(
    private readonly deviceRepo: IDeviceRepository,
    private readonly commandRepo: IDeviceCommandRepository,
    private readonly validator: IValidator<DeviceSendCommandRequest>,
    private readonly outboxRepo: IOutboxRepository,
    private readonly verifyToken: (token: string) => AuthResponse["user"]
  ) { }

  async call(req: DeviceSendCommandRequest): Promise<DeviceSendCommandResponse> {
    // 1. validate request
    const { value, errors } = this.validator.validate(req);
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid command request", errors);
    }

    // 2. check user permission
    const user = this.verifyToken(value.token);
    // TODO: implement checking for user in org here

    // 3. find associating device
    const device = await this.deviceRepo.findOneBy({ id: value.deviceId })
    if (!device) {
      throw new NotFoundError(`Device with id=${value.deviceId} not found`)
    }

    // 4. find command
    const command = await this.commandRepo.findOneBy({
      localId: value.payload.localId,
      deviceId: device.id
    })
    if (!command) {
      throw new NotFoundError(`Command with deviceId=${device.id} id=${value.deviceId} not found`)
    }

    // 5.2️⃣ Add to Outbx
    await this.outboxRepo.create({
      aggregateType: "device.command",
      aggregateId: command.id,
      status: "PENDING",
      topic: topics.deviceCommand.create({
        orgId: value.orgId,
        clusterId: device.clusterId,
        deviceId: device.id,
      }),
      payload: value.payload,
    });

    return { success: true, message: "Command pending" }
  }
}
