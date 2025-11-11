import { DeviceRegisteredEvent, DeviceRegisteredPayload } from "@domain/events/device-registered-event";
import { IDomainEventHandler } from "@domain/interfaces/events";
import { IRealtimeClient, RealtimeMessage } from "@domain/interfaces/realtime-client";

export class DeviceRegisteredEventHandler implements IDomainEventHandler<DeviceRegisteredEvent> {
  constructor(
    private readonly client: IRealtimeClient
  ) { }

  async handle(event: DeviceRegisteredEvent): Promise<void> {
    const message: RealtimeMessage<DeviceRegisteredPayload> = {
      orgId: event.orgId,
      clusterId: event.orgId,
      eventType: event.name,
      data: event.payload,
      ts: event.ts
    }
    await this.client.publishEvent(message)
  }
}
