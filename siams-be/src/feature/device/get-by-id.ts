import { IUseCase, IValidator } from "@shared/interfaces";
import { GetDeviceByIdResponse } from "./dtos/get-device-by-id-response";
import { GetDeviceByIdRequest } from "./dtos/get-device-by-id-request";
import { IAuthService } from "@domain/services/auth-service";
import { UnauthorizedError, ValidationError } from "@shared/errors";

export class GetDeviceByIdUC implements IUseCase<GetDeviceByIdResponse> {
  constructor(
    private readonly authService: IAuthService,
    private readonly validator: IValidator<GetDeviceByIdRequest>,
  ) { }

  async call(req: GetDeviceByIdRequest): Promise<GetDeviceByIdResponse> {
    const { value, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request");
    }

    const user = this.authService.verifyToken(value.token!);
    const data = await this.authService.canAccessDevice(user.id, value.deviceId!)
    if (data == null) {
      throw new UnauthorizedError("User doesn't have permission to access this device");
    }

    return data.device
  }
}
