import { DeviceActuator, DeviceCommand, DeviceSensor } from "@domain/entities";

export interface DeviceDTO {
  name?: string;
  clusterId: string;
  model: string;
  geom: object; // geojson
  firmwareVersion: string;
  sensors?: DeviceSensor[];
  actuators?: DeviceActuator[];
  commands?: DeviceCommand[];
  status: string;
  lastSeen?: Date;
  createdAt?: Date;
}
