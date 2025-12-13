import type { Anchor } from "../anchor";
import type { IBucketOf } from "../bucket";
import type { Device } from "./device";

export const DeviceEventTypeConstants = {
  DeviceRegistered: "device.registered",
  DeviceTelemetryReceived: "device.telemetry",
  DeviceStatusReceived: "device.status",
  DeviceStatusOnline: "device.status.online",
  DeviceStatusOffline: "device.status.offline",
  RuleTriggered: "device.rule.triggered",
} as const;

export type DeviceEventType = typeof DeviceEventTypeConstants[keyof typeof DeviceEventTypeConstants]

export interface DeviceEvent {
  event_uuid: string;
  event_type: DeviceEventType;
  event_payload: any;
  raw_payload: string;
  data_hash: string;
  created_at: string;
}

export type VerificationState =
  | 'NOT_ANCHORED'
  | 'ANCHOR_PENDING'
  | 'ANCHOR_CONFIRMED'
  | 'ANCHOR_FAILED';

export interface DeviceEventWithAnchor {
  event: DeviceEvent;
  anchor?: Anchor;
  verificationState: VerificationState;
}

export interface ListDeviceEventRequest {
  device_id: Device["id"];
  perBucket?: number;
}

export type ListDeviceEventResponse = Array<IBucketOf<DeviceEvent>>

