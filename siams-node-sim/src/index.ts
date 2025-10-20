import { RegisterDevicePayload } from "@feature/device/dtos/register-device-request";
import { topics } from "@config/mqtt-topics";
import mqtt from "mqtt";
import { v4 as uuidv4 } from "uuid"


const tempId = "temp-" + uuidv4(); // ID tạm
const clusterId = "082edbc1-9e31-45bc-a701-72f96ffcd2ef";
const orgId = "e400bd9a-6b31-4aff-8f25-3c8f3bad00a0"

let deviceId: string | null = null;

const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: tempId,
  clean: true
});

client.on("connect", () => {
  console.log(`[${tempId}] Connected to broker`);

  // Gửi registration message
  const regPayload: RegisterDevicePayload = {
    name: "device-simulator",
    model: "nodejs",
    firmwareVersion: "1.0.0",
    capabilities: {
      sensors: ["soil-moist", "temp"]
    }
  };
  client.publish(`org/${orgId}/cluster/${clusterId}/register/${tempId}`, JSON.stringify(regPayload));
  console.log(`[${tempId}] Sent registration request`);

  // Subscribe để nhận ack
  client.subscribe(topics.registerDevice.ack(orgId, clusterId, tempId));
});

// Nhận registration ack hoặc command
client.on("message", (topic, message) => {
  const payload = JSON.parse(message.toString());
  if (topic.includes("register-ack")) {
    deviceId = payload.deviceId;
    console.log(`[${tempId}] Received from register-ack`, payload);
    startTelemetry();
  } else if (topic.includes("command")) {
    console.log(`[${deviceId}] Received command: ${message.toString()}`);
  }
});

// Hàm bắt đầu publish telemetry sau khi có deviceId
function startTelemetry() {
  if (!deviceId) return;

  setInterval(() => {
    const payload = {
      deviceId,
      clusterId,
      sensorId: "soil-1",
      value: (Math.random() * 100).toFixed(2),
      timestamp: new Date().toISOString()
    };
    client.publish(
      `org/${orgId}/cluster/${clusterId}/node/${deviceId}/telemetry`,
      JSON.stringify(payload)
    );
    console.log(`[${deviceId}] Published telemetry`, payload);
  }, 5000);

  // Subscribe command channel
  client.subscribe(`org/${orgId}/cluster/${clusterId}/node/${deviceId}/command`);
}


console.log(`[${tempId}] waiting for broker`);
