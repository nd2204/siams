import { DeviceStatus } from "@domain/entities";
import { DeviceEventTypeConstants } from "@domain/entities/device-event";
import { IDomainEvent } from "@domain/interfaces/events";
import { PushStatusPayload } from "@feature/device/dtos";

export class DeviceStatusReceivedEvent implements IDomainEvent<PushStatusPayload> {
  name = DeviceEventTypeConstants.DeviceStatusReceived;
  ts = Date.now();

  constructor(
    public payload: DeviceStatus,
    public orgId: string,
    public deviceId: string,
  ) { }
}
