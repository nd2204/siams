import mqtt from "mqtt";
import { v4 as uuidv4 } from "uuid"

const tempId = "temp-" + uuidv4(); // ID tạm
const clusterId = "cluster-123";

let deviceId: string | null = null;

const client = mqtt.connect("mqtt://localhost:1883", {
  clientId: tempId,
  clean: true
});

client.on("connect", () => {
  console.log(`[${tempId}] Connected to broker`);

  // Gửi registration message
  const regPayload = {
    tempId,
    name: "device-simulator",
    sensors: ["soil-moisture", "temperature"]
  };
  client.publish(`org/siams/cluster/${clusterId}/register`, JSON.stringify(regPayload));
  console.log(`[${tempId}] Sent registration request`);

  // Subscribe để nhận ack
  client.subscribe(`org/demo/cluster/${clusterId}/register/ack/${tempId}`);
});

// Nhận registration ack hoặc command
client.on("message", (topic, message) => {
  const payload = JSON.parse(message.toString());
  if (topic.includes("register/ack")) {
    deviceId = payload.deviceId;
    console.log(`[${tempId}] Registered as ${deviceId}`);
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
      `org/siams/cluster/${clusterId}/node/${deviceId}/telemetry`,
      JSON.stringify(payload)
    );
    console.log(`[${deviceId}] Published telemetry`, payload);
  }, 5000);

  // Subscribe command channel
  client.subscribe(`org/demo/cluster/${clusterId}/node/${deviceId}/command`);
}


console.log(`[${tempId}] waiting for broker`);
