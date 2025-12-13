import { IUseCase, IValidator } from "@shared/interfaces";
import { ListRecentDeviceEventRequest, ListRecentDeviceEventResponse } from "./dtos";
import { IDeviceEventRepository } from "@domain/repositories";
import { ValidationError } from "@shared/errors";
import { IAuthService } from "@domain/services/auth-service";

export class ListRecentDeviceEventUC implements IUseCase<ListRecentDeviceEventResponse> {
  constructor(
    private readonly deviceEventRepo: IDeviceEventRepository,
    private readonly authService: IAuthService,
    private readonly validator: IValidator<ListRecentDeviceEventRequest>
  ) { }

  async call(req: ListRecentDeviceEventRequest): Promise<ListRecentDeviceEventResponse> {
    const { value: r, errors } = this.validator.validate(req);
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid Request", errors);
    }

    const userClaim = this.authService.verifyToken(r.token!);
    const { device } = await this.authService.canAccessDevice(userClaim.id, r.device_id);

    const res = await this.deviceEventRepo.listRecentBy({
      device_id: device.id
    }, r.perBucket);

    return res;
  }
}
