import { DeviceEventTypeConstants } from "@domain/entities/device-event";
import { IDomainEvent } from "@domain/interfaces/events";
import { TelemetryGroupDto } from "@feature/device/dtos";

export class DeviceTelemetryReceivedEvent implements IDomainEvent<TelemetryGroupDto> {
  name = DeviceEventTypeConstants.DeviceTelemetryReceived;
  ts = Date.now();

  constructor(
    public payload: TelemetryGroupDto,
    public orgId: string,
    public deviceId: string,
  ) { }
}
