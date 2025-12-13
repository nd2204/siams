import { IUseCase, IValidator } from "@shared/interfaces";
import { DeviceCommandAckPayload, DeviceCommandAckRequest } from "./dtos";
import { IDeviceRepository } from "@domain/repositories";
import { ISignatureVerificationService } from "@domain/services/signature-verification-service";
import { IDeviceEventPublisher } from "@domain/services/device-event-publisher";
import { ValidationError } from "@shared/errors";
import { DeviceNotFoundError } from "@domain/errors";
import { DeviceCommandAckEvent } from "@domain/events/device/device-command-ack-event";

export class DeviceCommandAckUC implements IUseCase<void> {
  constructor(
    private readonly deviceEventPublisher: IDeviceEventPublisher,
    private readonly deviceRepo: IDeviceRepository,
    private readonly signatureService: ISignatureVerificationService,
    private readonly payloadValidator: IValidator<DeviceCommandAckPayload>,
    private readonly validator: IValidator<DeviceCommandAckRequest>
  ) { }

  async call(req: DeviceCommandAckRequest): Promise<void> {
    const { value: r, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid device status request", errors)
    }

    const device = await this.deviceRepo.findOneBy({ id: r.device_id! })
    if (!device) {
      throw new DeviceNotFoundError(r.device_id)
    }

    const p = await this.signatureService.verify<DeviceCommandAckPayload>(
      device,
      r.payload,
      this.payloadValidator,
      Number.MAX_VALUE // ignore maxAge for lwt payload
    )

    await this.deviceEventPublisher.publish(
      new DeviceCommandAckEvent({
        org_id: device.org_id,
        device_id: device.id,
        status: p.status,
        message: p.message
      }),
      { store_event: { raw_payload: r.payload.raw_payload } }
    );
  }
}
