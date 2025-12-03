import { DeviceStatus } from "@domain/entities";
import { DeviceStatusReceivedEvent } from "@domain/events/device-status-received-event";
import { IDomainEventHandler } from "@domain/interfaces/events";
import { IRealtimeClient, RealtimeMessage } from "@domain/interfaces/realtime-client";
import { GetDeviceStatusResponse } from "@feature/device/dtos";

export class DeviceStatusReceivedEventHandler implements IDomainEventHandler<DeviceStatusReceivedEvent> {
  constructor(
    private readonly client: IRealtimeClient
  ) { }

  async handle(event: DeviceStatusReceivedEvent): Promise<void> {
    const message: RealtimeMessage<GetDeviceStatusResponse> = {
      deviceId: event.deviceId,
      orgId: event.orgId,
      eventType: event.name,
      data: {
        wifi: event.payload.wifiRssi,
        cpu: event.payload.cpuUsage,
        mem: event.payload.memUsage,
        online: event.payload.online,
        ts: event.payload.timestamp
      },
      ts: event.ts
    }
    await this.client.publishDeviceEvent(message);
  }
}
