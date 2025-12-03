import { IUseCase, IValidator } from "@shared/interfaces";
import { GetDeviceStatusRequest, GetDeviceStatusResponse } from "./dtos";
import { IDeviceStatusRepository } from "@domain/repositories/device-status-repo";
import { IAuthService } from "@domain/services/auth-service";
import { NotFoundError, ValidationError } from "@shared/errors";

export class GetDeviceStatusUC implements IUseCase<GetDeviceStatusResponse | null> {
  constructor(
    private readonly statusRepo: IDeviceStatusRepository,
    private readonly authService: IAuthService,
    private readonly validator: IValidator<GetDeviceStatusRequest>
  ) { }

  async call(req: GetDeviceStatusRequest): Promise<GetDeviceStatusResponse | null> {
    const { value: r, errors } = this.validator.validate(req);
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid device status request", errors);
    }

    const userClaim = this.authService.verifyToken(r.token!);
    const { device } = await this.authService.canAccessDevice(userClaim.id, r.device_id)

    const status = await this.statusRepo.getLatest(device.id)
    if (!status) {
      throw new NotFoundError(`No status found for device with id=${device.id}`);
    }

    const response: GetDeviceStatusResponse = {
      cpu: status.cpuUsage,
      mem: status.memUsage,
      wifi: status.wifiRssi,
      online: status.online,
      ts: status.timestamp,
    }

    return response
  }
}
