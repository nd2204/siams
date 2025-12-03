import { Entity } from "@domain/interfaces";

export const DeviceEventTypeConstants = {
  DeviceRegistered: "device.registered",
  DeviceTelemetryReceived: "device.telemetry",
  DeviceStatusReceived: "device.status",
  RuleTriggered: "device.rule.triggered",
} as const;

export type DeviceEventType = typeof DeviceEventTypeConstants[keyof typeof DeviceEventTypeConstants];

export class DeviceEvent extends Entity<DeviceEvent, number> {
  declare event_uuid?: string;
  declare event_type: DeviceEventType;

  declare device_id: string;
  declare cluster_id?: string;
  declare org_id: string;

  declare raw_payload: string;
  declare data_hash: string;
  declare created_at?: string;
}
