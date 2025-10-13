import Entity from "@shared/entity.js";

export type ActuatorState = 'off' | 'on';

export default class Actuator extends Entity<Actuator> {
  actuatorId!: string;
  type!: string;
  state: ActuatorState = 'off';
  lastChanged?: Date;

  activate(duration_ms?: number) {
    this.state = 'on';
    this.lastChanged = new Date();
    // duration handling is infra responsibility (timer), domain just records intent
  }

  deactivate() {
    this.state = 'off';
    this.lastChanged = new Date();
  }
}

