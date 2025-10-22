import Entity from "@domain/interfaces/entity";

export type SensorType =
  | "soilMoisture"
  | "temperature"
  | "humidity"
  | "lightIntensity"
  | "pHLevel"
  | "rainfall"
  | "windSpeed"
  | "soilNutrient"
  | "CO2"
  | "leafWetness";

export type SensorStatus = 'online' | 'offline' | 'removed'

export class Sensor extends Entity<Sensor, string> {
  declare deviceId: string;
  declare localId: number;
  declare type: SensorType;
  declare unit: string;
  declare status: SensorStatus;
  declare lastSeen: Date;
  // calibration?: { offset?: number; scale?: number };
  //
  // static normalize(sensor: Sensor, raw: number): number {
  //   const s = this.calibration ?? {};
  //   const scaled = raw * (s.scale ?? 1) + (s.offset ?? 0);
  //   return scaled;
  // }
}
