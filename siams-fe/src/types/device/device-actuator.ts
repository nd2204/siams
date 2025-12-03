export type ActuatorType =
  | 'VALVE'
  | 'PUMP'
  | 'FAN'
  | 'HEATER'
  | 'COOLER'
  | 'LED_LIGHT'
  | 'MOTOR'
  | 'RELAY';

export interface Actuator {
  id: string;
  device_id: string;
  local_id: number;
  name: string;
  type: ActuatorType;
}
