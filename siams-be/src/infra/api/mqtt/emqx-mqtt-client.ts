import mqtt, { IClientOptions } from "mqtt";
import { IMqttClient, IMqttHandler } from "@domain/interfaces";
import { parseTopic } from "@infra/utils/mqtt/parse-topic";
import { ILogger } from "@shared/interfaces";
import { matchTopic } from "@infra/utils/mqtt/match-topic";
import { IMqttPubOption } from "@domain/interfaces/mqtt-client";
import { matchHandler } from "@infra/utils/mqtt/match-handler";
import { SignedDevicePayload } from "@feature/device/dtos";

export class EmqxMqttClient implements IMqttClient {
  private client?: mqtt.MqttClient;
  private connected = false;
  private topicTree = {};

  constructor(
    private readonly url: string,
    private readonly logger: ILogger,
    private readonly options: IClientOptions,
    private readonly handlers: IMqttHandler[],
  ) {
    this.topicTree = this.build_topic_tree(handlers)
  }

  private build_topic_tree(handlers: IMqttHandler[]) {
    const tree = {};
    const paths = handlers.map(
      (h) => ({ array: h.topic.split('/'), handler: h })
    )

    paths.forEach((path) => {
      let currentNode = tree;
      for (let i = 0; i < path.array.length; i++) {
        const segment = path.array[i];
        // If the segment doesn't exist yet, create it.
        // If it's the last segment, set its value to 'true' (or some identifier).
        if (i === path.array.length - 1) {
          currentNode[segment] = path.handler; // Map the end of the path with handler
        } else {
          if (!currentNode[segment]) {
            currentNode[segment] = {}; // Create a new nested object (node)
          }
          // Move deeper into the tree structure for the next iteration
          currentNode = currentNode[segment];
        }
      }
    })

    return tree;
  }

  subscribe(topic: string): void {
    if (!this.client || !this.connected) throw new Error("MQTT not connected");
    this.client.subscribe(topic);
    this.logger.info({ msg: `Subscribed to ${topic}` });
  }

  async disconnect(): Promise<void> {
    this.client?.end();
    this.connected = false;
  }

  async connect(): Promise<void> {
    this.client = mqtt.connect(this.url, this.options);

    await new Promise<void>((resolve, reject) => {
      this.client!.on("connect", (packet) => {
        this.logger.info({ msg: `Connected`, obj: packet });
        this.connected = true
        this.handlers.forEach(h => this.subscribe(h.topic));
        resolve();
      });
      this.client!.on("error", (err: any) => {
        // this.logger.error({msg: `${err.code}`})
        reject(err)
      }
      );
    });

    this.client!.on("message", async (topic, msg) => {
      const payload = this.tryParse(msg.toString());
      // this.logger.info({ msg: `Rx [${topic}]`, obj: payload })
      // const handler = matchHandler(topic, this.topicTree);
      // if (handler) {
      //   const params = parseTopic(topic, handler.pattern);
      //   if (Object.keys(params).length > 0) {
      //     await handler.handle(this, params, payload);
      //   }
      // }
      for (const h of this.handlers) {
        // FIX: using this pattern matching could be the bottleneck
        // as the number of topics grows
        if (!matchTopic(h.topic, topic)) continue;
        const params = parseTopic(topic, h.pattern);
        if (Object.keys(params).length > 0) {
          await h.handle(this, params, payload);
        }
      }
    });
  }

  async publish(topic: string, payload: any, opts?: IMqttPubOption): Promise<void> {
    if (!this.client) throw new Error("MQTT not connected");
    this.client.publish(topic, JSON.stringify(payload), {
      qos: opts?.qos,
      retain: opts?.retained
    });
  }

  private tryParse(str: string): any {
    try { return JSON.parse(str); } catch { return str; }
  }
}
