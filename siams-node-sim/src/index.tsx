import React from "react"
import { SensorType } from "@domain/entities/sensor";
import { App } from "./ui/app"
import { withFullScreen } from "fullscreen-ink";
import { DeviceSimulatorManager } from "./manager";
import { ActuatorType } from "@domain/entities/actuator";
import { CommandCapability } from "@domain/entities/device-capabilities";
// import { DeviceSimulatorManager } from "./simulator.js";

async function main() {
  const cfg = {
    mqttUrl: process.env.MQTT_URL!,
    mqttOptions: { "clean": true },
    orgId: "19fb0bb0-3f5f-4a60-9f65-84ac8c858a1f",
    clusterId: "49150afa-c26b-4233-b75a-cce37490e938",
    // orgId: "",
    // clusterId: "",
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
    commands: [
      { action: "turn_something_on" },
      { action: "turn_something_on_pv", params: ["testArgs"] }
    ] as CommandCapability[],
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
    telemetryJitterMs: cfg.telemetryJitterMs || 1000
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
