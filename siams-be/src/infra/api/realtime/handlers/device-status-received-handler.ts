import { DeviceStatusReceivedEvent } from "@domain/events/device/";
import { IDomainEventHandler } from "@domain/interfaces/events";
import { IRealtimeClient } from "@domain/interfaces/realtime-client";

export class DeviceStatusReceivedEventHandler implements IDomainEventHandler<DeviceStatusReceivedEvent> {
  constructor(
    private readonly client: IRealtimeClient
  ) { }

  async handle(event: DeviceStatusReceivedEvent): Promise<void> {
    await this.client.publishDeviceEvent(event);
  }
}
