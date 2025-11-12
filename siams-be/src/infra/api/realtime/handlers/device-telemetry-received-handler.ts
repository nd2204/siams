import { DeviceTelemetryReceivedEvent } from "@domain/events/device-telemetry-received-event";
import { IDomainEventHandler } from "@domain/interfaces/events";
import { IRealtimeClient, RealtimeMessage } from "@domain/interfaces/realtime-client";
import { TelemetryGroupDto } from "@feature/device/dtos/telemtry-dto";

export class DeviceTelemetryReceivedEventHandler implements IDomainEventHandler<DeviceTelemetryReceivedEvent> {
  constructor(
    private readonly client: IRealtimeClient
  ) { }

  async handle(event: DeviceTelemetryReceivedEvent): Promise<void> {
    const message: RealtimeMessage<TelemetryGroupDto> = {
      orgId: event.orgId,
      clusterId: event.orgId,
      deviceId: event.deviceId,
      eventType: event.name,
      data: event.payload,
      ts: event.ts
    }

    await this.client.publishTelemetry(message)
  }
}
