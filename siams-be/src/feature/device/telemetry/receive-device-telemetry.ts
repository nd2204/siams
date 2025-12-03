import { IUseCase, IValidator } from "@shared/interfaces";
import { PushTelemetryPayload, PushTelemetryRequest } from "./dtos/push-telemetry-request";
import { IDeviceSensorRepository, IDeviceTelemetryRepository } from "@domain/repositories";
import { NotFoundError, ValidationError } from "@shared/errors";
import { DeviceTelemetry } from "@domain/entities";
import { ISignatureVerificationService } from "@domain/services/signature-verification-service";
import { IDeviceEventPublisher } from "@domain/services/device-event-publisher";
import { DeviceTelemetryReceivedEvent } from "@domain/events/device-telemetry-received-event";

export class ReceiveDeviceTelemetryUC implements IUseCase<DeviceTelemetry> {
  constructor(
    private readonly repo: IDeviceTelemetryRepository,
    private readonly sensorRepo: IDeviceSensorRepository,
    private readonly deviceEventPubliser: IDeviceEventPublisher,
    private readonly signatureService: ISignatureVerificationService,
    private readonly payloadValidator: IValidator<PushTelemetryPayload>,
    private readonly validator: IValidator<PushTelemetryRequest>
  ) { }

  async call(req: PushTelemetryRequest): Promise<DeviceTelemetry> {
    const { value: r, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid telemetry", errors);
    }

    const p = await this.signatureService.verify_with_device_id<PushTelemetryPayload>(
      req.deviceId,
      req.payload,
      this.payloadValidator
    );

    const sensor = await this.sensorRepo.findOneBy({
      local_id: p.localId!,
      device_id: r.deviceId!,
    })

    if (!sensor) {
      throw new NotFoundError(
        `Cannot found sensor with deviceId=${r.deviceId} and localId=${p.localId}`
      )
    }

    const telemetry = await this.repo.create({
      sensorId: sensor.id,
      timestamp: new Date(p.ts!),
      raw_payload: r.payload.raw_payload,
      value: p.value!,
    })

    const telemetryGroup: DeviceTelemetryReceivedEvent["payload"] = {
      bucket: telemetry.timestamp.toISOString(),
      sensorId: telemetry.sensorId,
      avgValue: telemetry.value,
      minValue: telemetry.value,
      maxValue: telemetry.value,
      count: 1
    }

    await this.deviceEventPubliser.publish({
      event_payload: telemetryGroup,
      device_id: r.deviceId,
      org_id: r.orgId,
      store_event: false,
      event_type: "device.telemetry"
    })
    return telemetry;
  }
}
