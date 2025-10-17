import Entity from "@domain/interfaces/entity";

export type SensorType = 'temp' | 'humi' | 'soil-moist' | 'illuminace'

export class Sensor extends Entity<Sensor, string> {
  declare device_id: string;
  declare local_id: string;
  declare name: string;
  declare type: SensorType;
  declare unit: string;
  declare created_at: Date;
  calibration?: { offset?: number; scale?: number };

  normalize(raw: number): number {
    const s = this.calibration ?? {};
    const scaled = raw * (s.scale ?? 1) + (s.offset ?? 0);
    return scaled;
  }
}
