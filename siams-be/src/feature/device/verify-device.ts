import { IDeviceRepository } from "@domain/repositories";
import { IUseCase, IValidator } from "@shared/interfaces";
import { DeviceVerifyResponse } from "./dtos/device-verify-response";
import { DeviceVerifyPayload, DeviceVerifyRequest } from "./dtos/device-verify-request";
import { ValidationError } from "@shared/errors";
import { ISignatureVerificationService } from "@domain/services/signature-verification-service";

export class VerifyDeviceUC implements IUseCase<DeviceVerifyResponse> {
  constructor(
    private readonly deviceRepo: IDeviceRepository,
    private readonly signatureService: ISignatureVerificationService,
    private readonly payloadValidator: IValidator<DeviceVerifyPayload>,
    private readonly validator: IValidator<DeviceVerifyRequest>
  ) { }

  async call(req: DeviceVerifyRequest): Promise<DeviceVerifyResponse> {
    const { value: r, errors: e } = this.validator.validate(req);
    if (e && e.length > 0) {
      throw new ValidationError("Invalid request", e);
    }

    const id = r.deviceId!;
    const device = await this.deviceRepo.findOneBy({ id });
    if (!device) {
      return { ok: false, error: `device with id ${id} not found` }
    }

    const p = await this.signatureService.verify<DeviceVerifyPayload>(
      device,
      r.payload!,
      this.payloadValidator
    )

    if (device.fw_ver != p.fw_ver) {
      return {
        ok: false,
        error: `mismatch firmware version detected device ${device.fw_ver}, you ${p.fw_ver}`
      }
    }

    return { ok: true }
  }
}
