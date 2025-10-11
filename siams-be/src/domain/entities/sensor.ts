export class Sensor {
  constructor(
    public sensorId: string,
    public type: string,
    public unit?: string,
    public calibration?: { offset?: number; scale?: number },
    public present = true
  ) { }

  normalize(raw: number): number {
    const s = this.calibration ?? {};
    const scaled = raw * (s.scale ?? 1) + (s.offset ?? 0);
    return scaled;
  }
}
