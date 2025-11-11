import { DeviceTelemetry } from "@domain/entities";

export interface RealtimeMessage<TData = any> {
  orgId: string,
  clusterId: string,
  deviceId?: string,
  eventType: string,
  data: TData,
  meta?: { source?: string },
  ts: number
}

export interface IRealtimeClient {
  publishTelemetry(message: RealtimeMessage<DeviceTelemetry>): Promise<void>;
  publishEvent(message: RealtimeMessage): Promise<void>;
}
