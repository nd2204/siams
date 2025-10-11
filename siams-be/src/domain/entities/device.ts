import type { ActuationIntent } from "@domain/services/threshold-evaluator.js";
import type { Threshold } from "@domain/value-objects/threshold.js";

import type { Actuator } from "./actuator.js";
import type { Schedule } from "./schedule.js";
import type { Sensor } from "./sensor.js";
import type { Telemetry } from "./telemetry.js";

export type DeviceStatus = 'degraded' | 'offline' | 'online';

export class Device {
  actuators: Actuator[];
  readonly deviceId: string;
  farmArea?: string;
  lastSeen?: Date;
  metadata?: Record<string, string> | undefined;
  name: string;
  schedules: Schedule[];
  sensors: Sensor[];
  status: DeviceStatus;
  thresholds: Threshold[];

  constructor(deviceId: string, opts?: Partial<Device>) {
    this.deviceId = deviceId;
    this.name = opts?.name ?? deviceId;
    this.sensors = opts?.sensors ?? [];
    this.actuators = opts?.actuators ?? [];
    this.thresholds = opts?.thresholds ?? [];
    this.schedules = opts?.schedules ?? [];
    this.status = opts?.status ?? 'offline';
    this.metadata = opts?.metadata;
  }

  // Evaluate a single telemetry reading and produce actuation intents (pure domain)
  evaluate(reading: Telemetry): ActuationIntent[] {
    // placeholder: real logic lives in ThresholdEvaluatorService
    return [];
  }

  markSeen(ts: Date = new Date()) {
    this.lastSeen = ts;
    this.status = 'online';
  }

  updateThreshold(sensorType: string, newT: Threshold) {
    // validate domain invariants (range, operator)
    const idx = this.thresholds.findIndex(t => t.sensorType === sensorType);
    if (idx >= 0) this.thresholds[idx] = newT;
    else this.thresholds.push(newT);
  }
}
