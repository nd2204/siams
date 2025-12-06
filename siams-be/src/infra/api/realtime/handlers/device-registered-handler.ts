import { DeviceRegisteredEvent } from "@domain/events/device/";
import { IDomainEventHandler } from "@domain/interfaces/events";
import { IRealtimeClient } from "@domain/interfaces/realtime-client";

export class DeviceRegisteredEventHandler implements IDomainEventHandler<DeviceRegisteredEvent> {
  constructor(
    private readonly client: IRealtimeClient
  ) { }

  async handle(event: DeviceRegisteredEvent): Promise<void> {
    await this.client.publishDeviceEvent(event)
  }
}
