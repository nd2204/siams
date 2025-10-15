import Entity from "@domain/entity";

export type ActuatorState = 'off' | 'on';

export class Actuator extends Entity<Actuator, string> {
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

