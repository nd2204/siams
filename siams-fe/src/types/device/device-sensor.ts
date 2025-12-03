export type SensorType =
  | 'TEMPERATURE'
  | 'HUMIDITY'
  | 'MOISTURE'
  | 'PH'
  | 'LIGHT_INTENSITY'
  | 'PRESSURE'
  | 'NPK'
  | 'WIND_SPEED';

export interface Sensor {
  id: string;
  device_id: string;
  local_id: number;
  name: string;
  type: SensorType;
  unit: string;
  last_update: Date;
}
