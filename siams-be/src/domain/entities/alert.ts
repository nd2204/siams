import { type Threshold } from "@domain/value-objects";
import { Entity } from "@domain/interfaces";

export type AlertLevel = 'critical' | 'info' | 'warning';

export class Alert extends Entity<Alert, string> {
  deviceId!: string;
  sensorType!: string;
  value!: number;
  threshold?: Threshold;
  level: AlertLevel = 'warning';
  createdAt: Date = new Date();
  acknowledged = false;

  acknowledge() { this.acknowledged = true; }
}
