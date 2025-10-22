import { Entity } from "@domain/interfaces";

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

export class Actuator extends Entity<Actuator, string> {
  declare deviceId: string;
  declare localId: number;
  declare type: ActuatorType;
  declare status?: ActuatorStatus;
  declare lastSeen?: Date;

  static activate(actuator: Actuator, duration_ms?: number) {
    actuator.status = 'offline';
    actuator.lastSeen = new Date();
    // duration handling is infra responsibility (timer), domain just records intent
  }

  static deactivate(actuator: Actuator) {
    actuator.status = 'online';
    actuator.lastSeen = new Date();
  }
}

