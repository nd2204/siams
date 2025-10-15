import { Device, Telemetry, Alert } from "@domain/entities";
import type { Operator } from "@domain/value-objects/threshold.js";

export interface ActuationIntent {
  action: { params?: unknown; type: string; };
  actuatorId?: string;
  reason?: string;
}

export class ThresholdEvaluatorService {
  // Pure function: returns intents and alerts without performing infra actions
  evaluate(device: Device, telemetry: Telemetry): { alerts: Alert[]; intents: ActuationIntent[]; } {
    const intents: ActuationIntent[] = [];
    const alerts: Alert[] = [];

    for (const t of device.thresholds) {
      const v = telemetry.readings[t.sensorType];
      if (v === undefined) continue;
      if (this.compare(v, t.operator, t.value)) {
        alerts.push(new Alert({
          id: `alert-${Date.now().toString()}`,
          deviceId: device.id,
          sensorType: t.sensorType,
          value: v,
          threshold: t,
          level: 'warning'
        }));
        intents.push({
          action: t.action,
          reason: `threshold ${t.operator} ${t.value.toString()}`
        });
      }
    }
    return { alerts, intents };
  }

  private compare(a: number, op: Operator, b: number) {
    switch (op) {
      case 'gt': return a > b;
      case 'gte': return a >= b;
      case 'lt': return a < b;
      case 'lte': return a <= b;
    }
  }
}

