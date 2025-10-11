export type ActuatorState = 'off' | 'on';
export class Actuator {
  constructor(
    public actuatorId: string,
    public type: string,
    public state: ActuatorState = 'off',
    public lastChanged?: Date
  ) { }

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

