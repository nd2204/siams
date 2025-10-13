import Entity from "@shared/entity.js";

export default class Sensor extends Entity<Sensor> {
  sensorId!: string;
  type!: string;
  unit?: string;
  calibration?: { offset?: number; scale?: number };
  present = true;

  normalize(raw: number): number {
    const s = this.calibration ?? {};
    const scaled = raw * (s.scale ?? 1) + (s.offset ?? 0);
    return scaled;
  }
}
