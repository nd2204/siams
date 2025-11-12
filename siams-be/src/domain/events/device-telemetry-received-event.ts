import { DeviceTelemetry } from "@domain/entities";
import { IDomainEvent } from "@domain/interfaces/events";
import { TelemetryGroupDto } from "@feature/device/dtos/telemtry-dto";

export class DeviceTelemetryReceivedEvent implements IDomainEvent<TelemetryGroupDto> {
  static readonly eventName = "device.telemetry"

  name = DeviceTelemetryReceivedEvent.eventName;
  ts = Date.now();

  constructor(
    public orgId: string,
    public clusterId: string,
    public deviceId: string,
    public payload: TelemetryGroupDto
  ) { }
}
