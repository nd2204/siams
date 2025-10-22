import { topics } from "@config/mqtt-topics";
import { SensorType } from "@domain/entities/sensor";
import { RegisterDevicePayload } from "@feature/device/dtos/register-device-request"
import { DeviceStatusPayload } from "@feature/telemetry/dtos/device-status-request"
import { DeviceTelemetryPayload } from "@feature/telemetry/dtos/device-telemetry-request"
import EventEmitter from "events";
import mqtt, { MqttClient } from "mqtt";
import { DeviceConfig, DeviceEventInput, LogLevel, TopicType } from "./data/types";
import { PresetStore } from "./data/preset-store";

export class DeviceClient {
  private client?: MqttClient;
  private deviceId: string;
  private stopped = false;
  private telemetryTimer?: NodeJS.Timeout;
  private statusTimer?: NodeJS.Timeout;
  private presetStore: PresetStore

  constructor(
    private emitter: EventEmitter,
    private cfg: DeviceConfig
  ) {
    this.deviceId = this.cfg.tempId
    this.presetStore = new PresetStore();
  }

  async start(): Promise<void> {
    this.emit({
      type: "created",
      sensors: this.cfg.capabilities.sensors,
      actuators: this.cfg.capabilities.actuators,
      commands: this.cfg.capabilities.commands
    });

    this.client = mqtt.connect(this.cfg.mqtt.url, {
      ...this.cfg.mqtt.opts,
      clientId: this.cfg.tempId,
      reconnectPeriod: 2000
    });

    this.client.on("connect", () => {
      this.emitLog("Info", `connected to broker as ${this.cfg.tempId}`)

      // Subscribe command topic for when deviceId assigned later (wildcard)
      const cmdWildcard = topics.deviceCommand.create({
        orgId: this.cfg.orgId,
        clusterId: this.cfg.clusterId,
        commandId: "+"
      });
      this.client!.subscribe(cmdWildcard);

      // only register when the deviceId is not provided
      if (!this.cfg.deviceId) {
        this.emitLog("Warn", "deviceId not found. requesting from backend...")
        this.publishRegister();
      } else {
        this.emitLog("Important", "deviceId exist. skiping publish register")
        this.emit({ type: "registered", deviceId: this.cfg.deviceId })
        this.deviceId = this.cfg.deviceId
      }
      this.startTelemetryLoop();
      this.startStatusLoop();
    });

    this.client.on("message", async (topic, msg) => {
      try {
        const type = this.getTopicType(topic)
        const p = JSON.parse(msg.toString());
        switch (type) {
          case "command": {
            this.handleCommandTopic(p); break;
          }
          case "register-ack": {
            this.handleRegisterTopic(p); break;
          }
          case "unknown":
          default:
            break
        }
      } catch (e) {
        this.emitLog("Warn", `invalid message`, e);
      }
    });

    this.client.on("error", (err) => { this.emitLog("Error", `mqtt err`, err.message); });
    this.client.on("close", () => {
      this.emitLog("Info", `mqtt closed`);
      this.clearTimers();
    });
  }

  // --------------------------------------------------------------------------------
  // Publisher Handler
  // --------------------------------------------------------------------------------

  private publishRegister() {
    // Subscribe ACK topic (tempId-based)
    // 1. create topic
    const ackTopic = topics.deviceRegisterAck.create({
      orgId: this.cfg.orgId,
      clusterId: this.cfg.clusterId,
      tempId: this.cfg.tempId
    });

    // 1. subscribe to that topic
    this.client!.subscribe(ackTopic, (err) => {
      if (err) this.emitLog("Error", `subscribe ack err`, err);
    });

    // Publish to register topic
    // 1. create topic
    const topic = topics.deviceRegister.create({
      orgId: this.cfg.orgId,
      clusterId: this.cfg.clusterId,
      tempId: this.cfg.tempId
    });

    // 2. create payload
    const payload: RegisterDevicePayload = {
      name: this.cfg.tempId,
      model: "simulated-device",
      firmwareVersion: "sim-1.0",
      location: { lat: 21.08, lon: 105.78 },
      capabilities: this.cfg.capabilities,
    };

    // 3. publish
    this.client!.publish(topic, JSON.stringify(payload), {}, (err) => {
      if (err) {
        this.emitLog("Error", `register publish failed: ${JSON.stringify(err, null, 2)}`);
      } else {
        this.emitLog("Important", `Published registration message`);
      }
    });
  }

  private startTelemetryLoop() {
    if (!this.deviceId) return;
    const sendTelemetry = async () => {
      if (this.stopped) return;

      // pick and set sensor mock value
      const idx = Math.floor(Math.random() * (this.cfg.capabilities.sensors.length))
      const sensor = this.cfg.capabilities.sensors[idx];
      if (!sensor) throw new Error(`${JSON.stringify(sensor)} ${idx}`)
      const value = this.mockValue(sensor.type);

      // create and publish payload
      const payload: DeviceTelemetryPayload = {
        localId: sensor.localId,
        value,
        ts: new Date().toISOString()
      };

      const topic = topics.deviceTelemetry.create({
        orgId: this.cfg.orgId,
        clusterId: this.cfg.clusterId,
        deviceId: this.deviceId!
      });
      this.client!.publish(topic, JSON.stringify(payload));

      // schedule next with jitter
      const jitter = (this.cfg.simulation.telemetryJitterMs || 0) * Math.random();
      this.telemetryTimer = setTimeout(
        sendTelemetry,
        this.cfg.simulation.telemetryIntervalMs + jitter
      );
      this.emit({
        type: "telemetry",
        localId: sensor.localId,
        sensor: sensor.type,
        value: value
      })
      this.emitLog("Info", `telemetry ${sensor.type}=${value} ${sensor.unit}`);
    };
    sendTelemetry();
  }

  private startStatusLoop() {
    if (!this.deviceId) return;
    const sendStatus = () => {
      if (this.stopped) return;
      const topic = topics.deviceStatus.create({
        orgId: this.cfg.orgId,
        clusterId: this.cfg.clusterId,
        deviceId: this.deviceId!
      });
      const payload: DeviceStatusPayload = {
        cpu: +(Math.random().toFixed(2)),
        mem: +(Math.random().toFixed(2)),
        wifi: Math.round(50 + Math.random() * 50),
        online: true,
        ts: new Date().toISOString()
      };
      this.emit({
        type: "status",
        cpu: payload.cpu!,
        mem: payload.mem!,
        wifi: payload.wifi!
      })
      this.emitLog("Important", "Publishing device status")
      this.client!.publish(topic, JSON.stringify(payload));
      this.statusTimer = setTimeout(sendStatus, this.cfg.simulation.statusIntervalMs);
    };
    sendStatus();
  }
  // --------------------------------------------------------------------------------
  // Message Handler
  // --------------------------------------------------------------------------------

  private handleCommandTopic(p: any) {
    this.emitLog("Important", `command received:`, p);

    // publish ack
    if (this.deviceId) {
      const ackTopic = topics.deviceCommandAck.create({
        orgId: this.cfg.orgId,
        clusterId: this.cfg.clusterId,
        deviceId: this.deviceId
      });
      const payload = JSON.stringify({
        commandId: p.commandId ?? null,
        status: "received",
        ts: new Date().toISOString()
      })
      this.client!.publish(ackTopic, payload);
    }
  }

  private handleRegisterTopic(p: any) {
    if (p && p.error) {
      this.emitLog("Error", "Received an error", p)
    } else if (p && p.deviceId) {
      // backend returns deviceId
      this.deviceId = p.deviceId;
      this.presetStore.save({
        ...(this.cfg),
        tempId: this.cfg.tempId,
        deviceId: p.deviceId,
        orgId: this.cfg.orgId,
        clusterId: this.cfg.clusterId,
      })
      this.emit({ type: "registered", deviceId: p.deviceId })
      this.emitLog("Important", `registered -> deviceId=${this.deviceId}`);
    }
  }

  // --------------------------------------------------------------------------------
  // Utils
  // --------------------------------------------------------------------------------

  private clearTimers() {
    if (this.telemetryTimer) clearTimeout(this.telemetryTimer);
    if (this.statusTimer) clearTimeout(this.statusTimer);
  }

  private getTopicType(topic: string): TopicType {
    if (topic.endsWith(`/register-ack/${this.cfg.tempId}`)) {
      return "register-ack"
    }
    if (topic.includes("/command")) {
      return "command"
    }
    return "unknown"
  }

  private mockValue(type: SensorType) {
    switch (type) {
      case "temperature": return +(20 + Math.random() * 10).toFixed(2);
      case "humidity": return +(40 + Math.random() * 30).toFixed(2);
      case "soilMoisture": return +(10 + Math.random() * 80).toFixed(2);
      case "lightIntensity": return +(1 + Math.random() * 1200).toFixed(2);
      case "pHLevel":
      case "rainfall":
      case "windSpeed":
      case "soilNutrient":
      case "CO2":
      case "leafWetness":
      default: return +(Math.random() * 100).toFixed(2);
    }
  }

  private emit(payload: DeviceEventInput) {
    payload.tempId = this.cfg.tempId
    this.emitter.emit("event", payload)
  }

  private emitLog(level: LogLevel, message: string, obj?: any) {
    message = `[${this.deviceId.slice(0, 8)}] ${message}`
    this.emit({ type: "log", level, message, obj })
  }

  stop() {
    this.stopped = true;
    this.clearTimers();
    try { this.client?.end(true); } catch { }
  }

}
