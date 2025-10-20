// import { ActuationIntent, ThresholdEvaluatorService } from "@domain/services/threshold-evaluator";
import { Actuator, Sensor } from "@domain/entities";
// import { Threshold, Schedule } from "@domain/value-objects";
import { Entity } from "@domain/interfaces";

export type DeviceStatus = 'offline' | 'online' | 'unregistered';

export class Device extends Entity<Device, string> {
  declare name: string;
  declare clusterId: string;
  declare model: string;
  declare firmwareVersion: string;
  status: DeviceStatus = 'offline';
  declare lastSeen?: Date;
  declare createdAt?: Date;

  constructor(opts: Device) {
    super(opts);
    this.name = opts?.name ?? opts?.id ?? "Unamed Device";
  }

  static markSeen(device: Device, ts: Date = new Date()) {
    device.lastSeen = ts;
    device.status = 'online';
  }

  // updateThreshold(sensorType: string, newT: Threshold) {
  //   // validate domain invariants (range, operator)
  //   const idx = this.thresholds.findIndex(t => t.sensorType === sensorType);
  //   if (idx >= 0) this.thresholds[idx] = newT;
  //   else this.thresholds.push(newT);
  // }
}
