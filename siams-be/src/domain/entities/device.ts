// import { ActuationIntent, ThresholdEvaluatorService } from "@domain/services/threshold-evaluator";
// import { Threshold, Schedule } from "@domain/value-objects";
import { Entity } from "@domain/interfaces";

export type DeviceStatus = 'offline' | 'online' | 'unregistered';

export class Device extends Entity<Device, string> {
  declare name?: string;
  declare clusterId: string;
  declare model: string;
  declare firmwareVersion: string;
  declare status: DeviceStatus;
  declare lastSeen?: Date;
  declare createdAt?: Date;

  constructor(opts: Device) {
    super(opts);
    this.name = opts.name ?? `${opts.model}-${this.firmwareVersion}`;
  }

  static markSeen(ts: Date = new Date()): Partial<Device> {
    return {
      lastSeen: ts,
      status: 'online',
    }
  }

  // updateThreshold(sensorType: string, newT: Threshold) {
  //   // validate domain invariants (range, operator)
  //   const idx = this.thresholds.findIndex(t => t.sensorType === sensorType);
  //   if (idx >= 0) this.thresholds[idx] = newT;
  //   else this.thresholds.push(newT);
  // }
}
