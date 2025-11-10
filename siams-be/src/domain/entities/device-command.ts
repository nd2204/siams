import { Entity } from "@domain/interfaces";
import { CommandDesc } from "@domain/value-objects/command";

// Store supported command for a device
// which including sensor and actuator and general actions
export class DeviceCommand extends Entity<DeviceCommand, string> {
  declare deviceId: string;

  // localId can be used to cross reference between actuator and sensors
  // or identifying general actions.
  // Doesn't need to be unique.
  declare localId: number;

  // For general commands
  declare name?: string;
  declare type?: string;

  declare commands: CommandDesc[];
}
