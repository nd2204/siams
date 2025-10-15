import Entity from "@domain/entity";

export type SensorType = 'temp' | 'humi' | 'soil-moist' | 'illuminace'

export class Sensor extends Entity<Sensor, string> {
  device_id: string
  name: string
  type: SensorType;
  unit: string;
  created_at: Date;
  calibration?: { offset?: number; scale?: number };

  normalize(raw: number): number {
    const s = this.calibration ?? {};
    const scaled = raw * (s.scale ?? 1) + (s.offset ?? 0);
    return scaled;
  }
}
