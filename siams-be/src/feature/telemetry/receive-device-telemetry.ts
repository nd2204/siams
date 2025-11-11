import { IUseCase, IValidator } from "@shared/interfaces";
import { DeviceTelemetryRequest } from "./dtos/device-telemetry-request";
import { IDeviceSensorRepository, IDeviceTelemetryRepository } from "@domain/repositories";
import { NotFoundError, ValidationError } from "@shared/errors";
import { DeviceTelemetry } from "@domain/entities";

export class ReceiveDeviceTelemetryUC implements IUseCase<DeviceTelemetry> {
  constructor(
    private readonly repo: IDeviceTelemetryRepository,
    private readonly sensorRepo: IDeviceSensorRepository,
    private readonly validator: IValidator<DeviceTelemetryRequest>
  ) { }

  async call(req: DeviceTelemetryRequest): Promise<DeviceTelemetry> {
    const { value, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid telemetry", errors);
    }

    const payload = value.payload!

    const sensor = await this.sensorRepo.findOneBy({
      localId: payload.localId!,
      deviceId: value.deviceId!,
    })

    if (!sensor) {
      throw new NotFoundError(
        `Cannot found sensor with deviceId=${value.deviceId} and localId=${payload.localId}`
      )
    }

    return await this.repo.create({
      sensorId: sensor.id,
      timestamp: new Date(payload.ts!),
      value: payload.value!,
    })
  }
}
