import { DeviceTelemetry } from "@domain/entities";
import { IDomainEvent } from "@domain/interfaces/events";

export class DeviceTelemetryReceivedEvent implements IDomainEvent<DeviceTelemetry> {
  name = "device.telemetry";
  ts = Date.now();

  constructor(
    public orgId: string,
    public clusterId: string,
    public deviceId: string,
    public payload: DeviceTelemetry
  ) { }
}
