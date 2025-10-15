/* WIP */

import type { Telemetry } from "@domain/entities";
import type { Threshold } from "@domain/value-objects";

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
