import { IDeviceStatusRepository } from "@domain/repositories/device-status-repo";
import { IUseCase, IValidator } from "@shared/interfaces";
import { DeviceStatusRequest } from "./dtos/device-status-request";
import { NotFoundError, ValidationError } from "@shared/errors";
import { IDeviceRepository } from "@domain/repositories";
import { Device } from "@domain/entities";

export class ReceiveDeviceStatusUC implements IUseCase<void> {
  constructor(
    private readonly deviceRepo: IDeviceRepository,
    private readonly statusRepo: IDeviceStatusRepository,
    private readonly validator: IValidator<DeviceStatusRequest>
  ) { }

  async call(req: DeviceStatusRequest): Promise<void> {
    const { value, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid device status request", errors)
    }

    const device = await this.deviceRepo.findOneBy({ id: value.deviceId! })
    if (!device) {
      throw new NotFoundError(`Cannot found device with Id=${value.deviceId}`)
    }

    await this.deviceRepo.update(
      device.id,
      (!!value.payload?.online) ? Device.markSeen(new Date()) : Device.markOffline()
    )

    // TODO: send realtime status to front end
    //

    const payload = value.payload!
    await this.statusRepo.create({
      deviceId: device.id,
      cpuUsage: payload.cpu,
      memUsage: payload.mem,
      wifiRssi: payload.wifi,
      // WARN: Assuming unix timestamp
      timestamp: new Date(payload.ts! * 1000)
    })
  }
}
