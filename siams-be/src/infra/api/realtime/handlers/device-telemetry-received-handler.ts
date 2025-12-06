import { DeviceTelemetryReceivedEvent } from "@domain/events/device";
import { IDomainEventHandler } from "@domain/interfaces/events";
import { IRealtimeClient } from "@domain/interfaces/realtime-client";

export class DeviceTelemetryReceivedEventHandler implements IDomainEventHandler<DeviceTelemetryReceivedEvent> {
  constructor(
    private readonly client: IRealtimeClient
  ) { }

  async handle(event: DeviceTelemetryReceivedEvent): Promise<void> {
    await this.client.publishDeviceEvent(event)
  }
}
