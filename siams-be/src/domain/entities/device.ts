// import { ActuationIntent, ThresholdEvaluatorService } from "@domain/services/threshold-evaluator";
import { Actuator, Sensor } from "@domain/entities";
// import { Threshold, Schedule } from "@domain/value-objects";
import { Entity } from "@domain/interfaces";

export type DeviceStatus = 'offline' | 'online' | 'unregistered';

export class Device extends Entity<Device, string> {
  declare name: string;
  declare clusterId: string
  // metadata?: Record<string, string> | undefined;
  status: DeviceStatus = 'offline';
  // actuators: Actuator[] = [];
  // schedules: Schedule[] = [];
  sensors: Sensor[] = [];
  // thresholds: Threshold[] = [];
  lastSeen?: Date;

  constructor(opts?: Partial<Device>) {
    super(opts);
    this.name = opts?.name ?? opts?.id ?? "Unamed Device";
  }

  // // Evaluate a single telemetry reading and produce actuation intents (pure domain)
  // evaluate(_reading: Telemetry): ActuationIntent[] {
  //   // placeholder: real logic lives in ThresholdEvaluatorService
  //   return ThresholdEvaluatorService.evaluate(this, _reading)[];
  // }

  markSeen(ts: Date = new Date()) {
    this.lastSeen = ts;
    this.status = 'online';
  }

  // updateThreshold(sensorType: string, newT: Threshold) {
  //   // validate domain invariants (range, operator)
  //   const idx = this.thresholds.findIndex(t => t.sensorType === sensorType);
  //   if (idx >= 0) this.thresholds[idx] = newT;
  //   else this.thresholds.push(newT);
  // }
}
