import { IUseCase, IValidator } from "@shared/interfaces";
import { ListTelemetryResponse } from "./dtos/list-telemetry-response";
import { ListTelemetryRequest } from "./dtos/list-telemetry-request";
import { IAuthService } from "@domain/services/auth-service";
import { UnauthorizedError, ValidationError } from "@shared/errors";
import { IDeviceTelemetryRepository } from "@domain/repositories";

export class ListTelemetryUC implements IUseCase<ListTelemetryResponse> {
  constructor(
    private readonly telemetryRepo: IDeviceTelemetryRepository,
    private readonly authService: IAuthService,
    private readonly validator: IValidator<ListTelemetryRequest>
  ) {

  }
  async call(req: ListTelemetryRequest): Promise<ListTelemetryResponse> {
    const { value, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    const user = this.authService.verifyToken(value.token!);
    const device = await this.authService.canAccessDevice(user.id, value.deviceId!);
    if (!device) {
      throw new UnauthorizedError()
    }

    return await this.telemetryRepo.listByRange(
      value.sensorId!,
      value.from!,
      value.to!,
      value.groupBy!
    )
  }
}
