import { Entity } from "@domain/interfaces";

export const DeviceEventTypeConstants = {
  DeviceCommandAck: "device.command.ack",
  DeviceRegistered: "device.registered",
  DeviceTelemetryReceived: "device.telemetry",
  DeviceStatusReceived: "device.status",
  // track how long did the device stay online or offline
  DeviceStatusOnline: "device.status.online",
  DeviceStatusOffline: "device.status.offline",
  DeviceRuleTriggered: "device.rule.triggered",
} as const;

export type DeviceEventType = typeof DeviceEventTypeConstants[keyof typeof DeviceEventTypeConstants];

export class DeviceEvent extends Entity<DeviceEvent, number> {
  declare event_uuid: string;
  declare event_type: DeviceEventType;

  declare device_id: string;
  declare cluster_id?: string;
  declare org_id: string;

  declare raw_payload: string;
  declare data_hash: string;
  declare created_at?: Date;
}
