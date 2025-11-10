import { App } from "./ui/app"
import { withFullScreen } from "fullscreen-ink";
import { DeviceSimulatorManager } from "./manager";
import { ActuatorType, SensorType } from "@domain/entities";
import meow from "meow";
import { CommandDesc } from "@domain/value-objects/command";
// import { DeviceSimulatorManager } from "./simulator.js";

async function main() {
  const cli = meow(`
Usage
$ cli --source <url>

Options
--org, -o  Organization Id (required)
--cluster, -c  Cluster Id (required)

Examples
$ cli --source https://example.com/data.json
`, {
    importMeta: import.meta,
    flags: {
      org: {
        type: 'string',
        shortFlag: 'o',
        isRequired: true,
      },
      cluster: {
        type: 'string',
        shortFlag: 'c',
        isRequired: true,
      }
    }
  });

  const commands: { commands: CommandDesc[] }[] = [
    { commands: [{ action: "turn_something_on" }] },
    { commands: [{ action: "turn_something_on_pv", params: [{ name: "testArgs", type: "string" }] }] },
  ]

  const cfg = {
    mqttUrl: process.env.MQTT_URL!,
    mqttOptions: { "clean": true },
    orgId: cli.flags.org,
    clusterId: cli.flags.cluster,
    count: 6,
    telemetryIntervalMs: 5000,
    statusIntervalMs: 30000,
    sensors: [
      { type: "soilMoisture", unit: "%" },
      { type: "temperature", unit: "°C" },
      { type: "humidity", unit: "%" },
      { type: "lightIntensity", unit: "lux" },
      { type: "pHLevel", unit: "pH" },
      { type: "rainfall", unit: "mm" },
      { type: "windSpeed", unit: "m/s" },
      { type: "soilNutrient", unit: "ppm" },
      { type: "CO2", unit: "ppm" },
      { type: "leafWetness", unit: "mV" }
    ] as { type: SensorType, unit: string }[],
    actuators: [
      { type: "waterPump" },
      { type: "irrigationValve" },
      { type: "fertilizerDispenser" },
      { type: "coolingFan" },
      { type: "heater" },
      { type: "shadeMotor" },
      { type: "mistingSystem" },
      { type: "ventilationFlap" },
      { type: "seedDispenser" },
      { type: "lightingRelay" }
    ] as { type: ActuatorType }[],
    commands: commands,
    telemetryJitterMs: 1000,
    startClientId: "sim-"
  };

  // const mgr = new DeviceSimulatorManager();
  const mgr = new DeviceSimulatorManager({
    mqttUrl: cfg.mqttUrl,
    mqttOptions: cfg.mqttOptions,
    orgId: cfg.orgId || "",
    clusterId: cfg.clusterId || "",
    sensors: cfg.sensors,
    actuators: cfg.actuators,
    commands: cfg.commands,
    telemetryIntervalMs: cfg.telemetryIntervalMs || 5000,
    statusIntervalMs: cfg.statusIntervalMs || 30000,
    telemetryJitterMs: cfg.telemetryJitterMs || 1000,
  });

  process.on("SIGINT", () => {
    console.log("Stopping simulators...");
    mgr.stopAll();
    process.exit(0);
  });

  withFullScreen(<App emitter={mgr} />).start();
  mgr.spawn(cfg.count, cfg.startClientId);
}


main().catch(err => {
  console.error(err); process.exit(1);
});
