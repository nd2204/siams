import type { Telemetry } from "@domain/entities/index.ts";
import type { Threshold } from "@domain/value-objects/index.ts";

export interface CommandAckedEvent {
  commandId: string;
  deviceId: string;
}

export interface TelemetryReceivedEvent {
  deviceId: string;
  telemetry: Telemetry;
}

export interface ThresholdBreachedEvent {
  deviceId: string;
  reading: number;
  threshold: Threshold;
}
