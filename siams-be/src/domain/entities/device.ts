import { ActuationIntent } from "@domain/services/threshold-evaluator";
import { Actuator, Sensor, Telemetry } from "@domain/entities";
import { Threshold, Schedule } from "@domain/value-objects";
import Entity from "@domain/entity";

export type DeviceStatus = 'degraded' | 'offline' | 'online';

export class Device extends Entity<Device, string> {
  name!: string;
  farmArea?: string;
  metadata?: Record<string, string> | undefined;
  status: DeviceStatus = 'offline';
  actuators: Actuator[] = [];
  schedules: Schedule[] = [];
  sensors: Sensor[] = [];
  thresholds: Threshold[] = [];
  lastSeen?: Date;

  constructor(deviceId: string, opts?: Partial<Device>) {
    super(opts);
    this.id = deviceId;
    this.name = opts?.name ?? deviceId;
  }

  // Evaluate a single telemetry reading and produce actuation intents (pure domain)
  evaluate(_reading: Telemetry): ActuationIntent[] {
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
