import { IUseCase, IValidator } from "@shared/interfaces";
import { GetAllSensorsResponse } from "./dtos/get-all-sensors-response";
import { GetAllSensorsRequest } from "./dtos/get-all-sensors-request";
import { IDeviceSensorRepository } from "@domain/repositories";
import { IAuthService } from "@domain/services/auth-service";
import { UnauthorizedError, ValidationError } from "@shared/errors";

export class GetAllSensorsUC implements IUseCase<GetAllSensorsResponse> {
  constructor(
    private readonly sensorRepo: IDeviceSensorRepository,
    private readonly authService: IAuthService,
    private readonly validator: IValidator<GetAllSensorsRequest>
  ) { }

  async call(req: GetAllSensorsRequest): Promise<GetAllSensorsResponse> {
    const { value, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    const user = this.authService.verifyToken(value.token!)
    const device = await this.authService.canAccessDevice(user.id, value.deviceId!);
    if (!device) {
      throw new UnauthorizedError();
    }

    const sensors = await this.sensorRepo.findAllBy({ deviceId: device.id }) ?? []
    return sensors
  }
}
