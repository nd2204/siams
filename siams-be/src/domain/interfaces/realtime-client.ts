import { TelemetryGroupDto } from "@feature/device/dtos";

export interface RealtimeMessage<TData = any> {
  orgId: string,
  clusterId?: string,
  deviceId?: string,
  eventType: string,
  data: TData,
  meta?: { source?: string },
  ts: number
}

export interface IRealtimeClient {
  publishTelemetry(message: RealtimeMessage<TelemetryGroupDto>): Promise<void>;
  publishDeviceEvent(message: RealtimeMessage): Promise<void>;
}
