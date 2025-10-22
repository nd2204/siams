import { type Threshold } from "@domain/value-objects";
import { Entity } from "@domain/interfaces";

export type DeviceEventType = "SYSTEM" | "ACTION" | "SENSOR"
export type DeviceEventSeverity = "critical" | "high" | "normal" | "low"

export class DeviceEvent extends Entity<DeviceEvent, string> {
  declare deviceId: string;
  declare clusterId: string;
  declare orgId: string;
  declare type: DeviceEventType;
  declare severity: DeviceEventSeverity;
  declare title: string;
  declare message: string;
  declare payload?: EventPayloadType;
  declare timestamp: string;
}

export type EventPayloadType =
  | SensorEventPayload
  | ActuationEventPayload
  | SystemEventPayload

export class SystemEventPayload {
  constructor(
    public reason: string
  ) { }
}

export class SensorEventPayload {
  constructor(
    public sensorId: number,
    public value: number,
    public threshold: number
  ) { }
}

export class ActuationEventPayload {
  constructor(
    public actuatorId: number,
    public reason: string
  ) { }
}
