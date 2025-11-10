import { Entity } from "@domain/interfaces";
import { CommandDesc } from "@domain/value-objects/command";

export type ActuatorType =
  | "waterPump"
  | "irrigationValve"
  | "fertilizerDispenser"
  | "coolingFan"
  | "heater"
  | "shadeMotor"
  | "mistingSystem"
  | "ventilationFlap"
  | "seedDispenser"
  | "lightingRelay";


export type ActuatorStatus = 'offline' | 'online';

export class DeviceActuator extends Entity<DeviceActuator, string> {
  declare deviceId: string;
  declare localId: number;
  declare name: string;
  declare type: ActuatorType;
  declare status: ActuatorStatus;

  static activate(actuator: DeviceActuator, duration_ms?: number) {
    actuator.status = 'offline';
    // duration handling is infra responsibility (timer), domain just records intent
  }

  static deactivate(actuator: DeviceActuator) {
    actuator.status = 'online';
  }
}

