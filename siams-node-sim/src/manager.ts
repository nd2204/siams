import { DeviceClient } from "./device";
import EventEmitter from "node:events";
import { randomInt } from "node:crypto";
import { v4 } from "uuid";
import { DeviceConfig, GlobalConfig } from "./data/types";
import { PresetStore } from "./data/preset-store";
import { type } from "node:os";

// --- Utility for random selection ---
function pickRandom<T>(arr: readonly T[], count: number): T[] {
  return arr
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export class DeviceSimulatorManager extends EventEmitter {
  private devices: DeviceClient[] = [];
  private presetStore: PresetStore;

  constructor(
    private globalCfg: GlobalConfig
  ) {
    super()
    this.presetStore = new PresetStore();
  }

  async loadPreset(tempId: string): Promise<DeviceConfig | null> {
    return await this.presetStore.load(tempId);
  }

  async savePreset(config: DeviceConfig): Promise<void> {
    await this.presetStore.save(config);
  }

  createRandomPreset(
    tempId?: string,
    orgId?: string,
    clusterId?: string
  ): DeviceConfig {
    let autoId = 1;
    tempId = tempId || `${v4()}`;
    return {
      orgId: orgId || this.globalCfg.orgId,
      clusterId: clusterId || this.globalCfg.clusterId,
      tempId,
      mqtt: {
        url: this.globalCfg.mqttUrl,
        opts: this.globalCfg.mqttOptions,
      },
      simulation: {
        telemetryIntervalMs: this.globalCfg.telemetryIntervalMs,
        statusIntervalMs: this.globalCfg.statusIntervalMs,
        telemetryJitterMs: this.globalCfg.telemetryJitterMs,
      },
      capabilities: {
        sensors: pickRandom(this.globalCfg.sensors, randomInt(0, this.globalCfg.sensors.length)).map((s) => ({
          localId: autoId++,
          name: s.type,
          type: s.type,
          unit: s.unit
        })),
        actuators: pickRandom(this.globalCfg.actuators, randomInt(0, this.globalCfg.actuators.length)).map((a) => ({
          localId: autoId++,
          name: a.type,
          type: a.type
        })),
        commands: pickRandom(this.globalCfg.commands, randomInt(0, this.globalCfg.commands.length)).map((c) => ({
          localId: autoId,
          commands: c.commands
        }))
      }
    }
  }

  async spawn(count: number, startIdPrefix = "sim-") {
    for (let i = 0; i < count; i++) {
      const tempId = `${startIdPrefix}${i + 1}`
      // const cfg: DeviceConfig = this.createRandomPreset(`${startIdPrefix}${i + 1}`);
      const cfg: DeviceConfig = await this.loadPreset(tempId) || this.createRandomPreset(tempId);
      const d = new DeviceClient(this, cfg);
      this.devices.push(d);
      // stagger start a bit to avoid burst
      await new Promise(res => setTimeout(res, 50));
      d.start().catch((error) => console.error(error));
    }
  }

  stopAll() {
    for (const d of this.devices) d.stop();
  }
}
