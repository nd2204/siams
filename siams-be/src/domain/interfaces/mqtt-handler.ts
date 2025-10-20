import { IMqttClient } from "./mqtt-client";

export interface IMqttHandler<TPayload = any, TParam = any> {
  topic: string; // subscribe topic
  pattern: string;
  handle(
    client: IMqttClient,
    params: TParam,
    payload: TPayload
  ): Promise<void>;
}
