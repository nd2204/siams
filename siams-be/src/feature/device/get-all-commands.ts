import { IUseCase, IValidator } from "@shared/interfaces";
import { GetAllCommandsResponse } from "./dtos/get-all-commands-response";
import { GetAllCommandsRequest } from "./dtos/get-all-commands-request";
import { IDeviceCommandRepository } from "@domain/repositories";
import { IAuthService } from "@domain/services/auth-service";
import { UnauthorizedError, ValidationError } from "@shared/errors";

export class GetAllCommandsUC implements IUseCase<GetAllCommandsResponse> {
  constructor(
    private readonly commandRepo: IDeviceCommandRepository,
    private readonly authService: IAuthService,
    private readonly validator: IValidator<GetAllCommandsRequest>
  ) { }

  async call(req: GetAllCommandsRequest): Promise<GetAllCommandsResponse> {
    const { value, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    const user = this.authService.verifyToken(value.token!)
    const device = await this.authService.canAccessDevice(user.id, value.deviceId!);
    if (!device) {
      throw new UnauthorizedError();
    }

    const commands = await this.commandRepo.findAllBy({ deviceId: device.id }) ?? []
    return commands
  }
}
