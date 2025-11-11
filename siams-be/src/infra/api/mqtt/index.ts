import config from "@/config";
import { EmqxMqttClient } from "./emqx-mqtt-client";
import { SMLogger } from "@shared/logger";
import { handlers } from "./handlers";

export const mqttClient = new EmqxMqttClient(
  config.app.mqtt.url,
  new SMLogger("infra:mqtt:EmqxMqttClient"),
  { clientId: "siams-be" },
  handlers
)
