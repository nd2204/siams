import type { Telemetry } from "./entities/telemetry.ts";
import type { Threshold } from "./value-objects/threshold.ts";

export interface CommandAckedEvent { commandId: string; deviceId: string; }
// domain/events.ts
export interface TelemetryReceivedEvent { deviceId: string; telemetry: Telemetry; }
export interface ThresholdBreachedEvent { deviceId: string; reading: number; threshold: Threshold; }

