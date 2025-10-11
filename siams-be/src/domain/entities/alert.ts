import { type Threshold } from "@domain/value-objects/threshold.js";

export type AlertLevel = 'critical' | 'info' | 'warning';
export class Alert {
  constructor(
    public alertId: string,
    public deviceId: string,
    public sensorType: string,
    public value: number,
    public threshold?: Threshold,
    public level: AlertLevel = 'warning',
    public createdAt: Date = new Date(),
    public acknowledged = false
  ) { }
  acknowledge() { this.acknowledged = true; }
}
