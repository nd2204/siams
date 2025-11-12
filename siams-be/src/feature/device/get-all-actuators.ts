import { IUseCase, IValidator } from "@shared/interfaces";
import { GetAllActuatorsResponse } from "./dtos/get-all-actuators-response";
import { GetAllActuatorsRequest } from "./dtos/get-all-actuators-request";
import { IDeviceActuatorRepository } from "@domain/repositories";
import { IAuthService } from "@domain/services/auth-service";
import { UnauthorizedError, ValidationError } from "@shared/errors";

export class GetAllActuatorsUC implements IUseCase<GetAllActuatorsResponse> {
  constructor(
    private readonly actuatorRepo: IDeviceActuatorRepository,
    private readonly authService: IAuthService,
    private readonly validator: IValidator<GetAllActuatorsRequest>
  ) { }

  async call(req: GetAllActuatorsRequest): Promise<GetAllActuatorsResponse> {
    const { value, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    const user = this.authService.verifyToken(value.token!)
    const data = await this.authService.canAccessDevice(user.id, value.deviceId!);
    if (!data) {
      throw new UnauthorizedError();
    }

    const actuators = await this.actuatorRepo.findAllBy({ deviceId: data.device.id }) ?? []
    return actuators
  }
}
