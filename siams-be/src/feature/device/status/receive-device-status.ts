import { IDeviceStatusRepository } from "@domain/repositories/device-status-repo";
import { IUseCase, IValidator } from "@shared/interfaces";
import { NotFoundError, ValidationError } from "@shared/errors";
import { IDeviceRepository } from "@domain/repositories";
import { Device, DeviceStatus } from "@domain/entities";
import { PushStatusPayload, PushStatusRequest } from "./dtos";
import { ISignatureVerificationService } from "@domain/services/signature-verification-service";
import { IDeviceEventPublisher } from "@domain/services/device-event-publisher";
import { DeviceNotFoundError } from "@domain/errors";

export class ReceiveDeviceStatusUC implements IUseCase<DeviceStatus> {
  constructor(
    private readonly deviceEventPublisher: IDeviceEventPublisher,
    private readonly deviceRepo: IDeviceRepository,
    private readonly statusRepo: IDeviceStatusRepository,
    private readonly signatureService: ISignatureVerificationService,
    private readonly payloadValidator: IValidator<PushStatusPayload>,
    private readonly validator: IValidator<PushStatusRequest>
  ) { }

  async call(req: PushStatusRequest): Promise<DeviceStatus> {
    const { value: r, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid device status request", errors)
    }

    const device = await this.deviceRepo.findOneBy({ id: r.deviceId! })
    if (!device) {
      throw new DeviceNotFoundError(r.deviceId)
    }

    const p = await this.signatureService.verify<PushStatusPayload>(
      device,
      r.payload,
      this.payloadValidator,
      Number.MAX_VALUE // ignore maxAge for lwt payload
    )

    await this.deviceRepo.update(
      device.id,
      (!!p.online) ? Device.markSeen(new Date()) : Device.markOffline()
    )

    const status = await this.statusRepo.create({
      device_id: device.id,
      cpuUsage: p.cpu,
      memUsage: p.mem,
      wifiRssi: p.wifi,
      online: p.online,
      timestamp: new Date(p.ts!)
    })

    await this.deviceEventPublisher.publish({
      org_id: device.org_id,
      device_id: device.id,
      store_event: false,
      event_type: "device.status",
      event_payload: status
    });

    return status;
  }
}
