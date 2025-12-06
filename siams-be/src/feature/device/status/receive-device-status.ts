import { IDeviceStatusRepository } from "@domain/repositories/device-status-repo";
import { IUseCase, IValidator } from "@shared/interfaces";
import { ValidationError } from "@shared/errors";
import { IDeviceRepository } from "@domain/repositories";
import { Device, DeviceStatus } from "@domain/entities";
import { PushStatusPayload, PushStatusRequest } from "./dtos";
import { ISignatureVerificationService } from "@domain/services/signature-verification-service";
import { IDeviceEventPublisher } from "@domain/services/device-event-publisher";
import { DeviceNotFoundError } from "@domain/errors";
import { DeviceOfflineEvent, DeviceOnlineEvent, DeviceStatusReceivedEvent } from "@domain/events/device";

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

    const isDeviceOnline = device.status !== "offline" && device.status !== "unregistered"
    // device online state change
    if (isDeviceOnline !== p.online) {
      await this.deviceEventPublisher.publish((!!p.online)
        ? new DeviceOnlineEvent({
          org_id: device.org_id,
          device_id: device.id,
        })
        : new DeviceOfflineEvent({
          org_id: device.org_id,
          device_id: device.id,
        }),
        { store_event: { raw_payload: r.payload.raw_payload } }
      );

      await this.deviceRepo.update(
        device.id,
        (!!p.online) ? Device.markSeen(new Date(p.ts)) : Device.markOffline()
      )
    }

    const savedStatus = await this.statusRepo.create({
      device_id: device.id,
      cpuUsage: p.cpu,
      memUsage: p.mem,
      wifiRssi: p.wifi,
      online: p.online,
      timestamp: new Date(p.ts!)
    })

    const event = new DeviceStatusReceivedEvent({
      cpu: savedStatus.cpuUsage,
      mem: savedStatus.memUsage,
      wifi: savedStatus.wifiRssi,
      online: false,
      ts: savedStatus.timestamp,
      org_id: device.org_id,
      device_id: device.id
    })

    await this.deviceEventPublisher.publish(event);

    return savedStatus;
  }
}
