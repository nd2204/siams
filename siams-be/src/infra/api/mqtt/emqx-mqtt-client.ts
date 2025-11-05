import mqtt, { IClientOptions } from "mqtt";
import { IMqttClient, IMqttHandler } from "@domain/interfaces";
import { parseTopic } from "@infra/utils/mqtt/parse-topic";
import { ILogger } from "@shared/interfaces";
import { matchTopic } from "@infra/utils/mqtt/match-topic";

export class EmqxMqttClient implements IMqttClient {
  private client?: mqtt.MqttClient;
  private connected = false;

  constructor(
    private readonly url: string,
    private readonly logger: ILogger,
    private readonly options: IClientOptions,
    private readonly handlers: IMqttHandler[],
  ) { }

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
      this.logger.info({ msg: `Rx [${topic}]:`, obj: payload })

      for (const h of this.handlers) {
        // NOTE: using this pattern matching could be the bottleneck
        // as the number of topics grows
        if (!matchTopic(h.topic, topic)) continue;
        const params = parseTopic(topic, h.pattern);
        if (Object.keys(params).length > 0) {
          await h.handle(this, params, payload);
        }
      }
    });
  }

  async publish(topic: string, payload: any): Promise<void> {
    if (!this.client) throw new Error("MQTT not connected");
    this.client.publish(topic, JSON.stringify(payload));
  }

  private tryParse(str: string): any {
    try { return JSON.parse(str); } catch { return str; }
  }
}
