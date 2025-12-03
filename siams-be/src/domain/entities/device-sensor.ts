import Entity from "@domain/interfaces/entity";

export type SensorType =
  | "MOISTURE"
  | "TEMPERATURE"
  | "HUMIDITY"
  | "LIGHT_INTENSITY"
  | "PH_LEVEL"
  | "RAINFALL"
  | "WINDSPEED"
  | "SOIL_NUTRIENT"
  | "CO2"
  | "LEAF_WETNESS";

export type SensorStatus = 'online' | 'offline' | 'removed'

export class DeviceSensor extends Entity<DeviceSensor, string> {
  declare device_id: string;
  declare local_id: number;
  declare name: string;
  declare type: SensorType;
  declare unit: string;
  declare status: SensorStatus;
  declare last_seen_at: Date;

  // calibration?: { offset?: number; scale?: number };
  //
  // static normalize(sensor: Sensor, raw: number): number {
  //   const s = this.calibration ?? {};
  //   const scaled = raw * (s.scale ?? 1) + (s.offset ?? 0);
  //   return scaled;
  // }
}
