import { IDeviceRepository } from "@domain/repositories";
import { IUseCase, IValidator } from "@shared/interfaces";
import { DeviceVerifyResponse } from "./dtos/device-verify-response";
import { DeviceVerifyRequest } from "./dtos/device-verify-request";
import { ValidationError } from "@shared/errors";

export class VerifyDeviceUC implements IUseCase<DeviceVerifyResponse> {
  constructor(
    private readonly deviceRepo: IDeviceRepository,
    private readonly validator: IValidator<DeviceVerifyRequest>
  ) { }

  async call(req: DeviceVerifyRequest): Promise<DeviceVerifyResponse> {
    const { value, errors } = this.validator.validate(req);
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    const id = value.deviceId!;

    const device = await this.deviceRepo.findOneBy({ id });
    if (!device) {
      return { status: "fail", reason: `device with id ${id} not found` }
    }

    const firmwareVersion = req.payload!.firmwareVersion!;
    if (device.firmwareVersion != firmwareVersion) {
      await this.deviceRepo.delete(device.id);
      return { status: "fail", reason: `mismatch firmware version detected` }
    }

    return { status: "ok" }
  }
}
