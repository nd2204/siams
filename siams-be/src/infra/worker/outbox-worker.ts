// src/infra/workers/OutboxWorker.ts
import { IMqttClient } from "@/domain/interfaces";
import { topics } from "@config/mqtt-topics";
import { IOutboxRepository } from "@domain/repositories/outbox-repo";
import { ILogger } from "@shared/interfaces";

export class OutboxWorker {
  private isRunning = false;
  private mqttClient: IMqttClient;

  constructor(
    private readonly outboxRepo: IOutboxRepository,
    private readonly logger: ILogger,
    private readonly pollInterval = 3000
  ) { }

  async start(client: IMqttClient): Promise<void> {
    if (this.isRunning) return;
    this.mqttClient = client;
    this.isRunning = true;
    this.logger.info("Started");

    while (this.isRunning) {
      try {
        await this.processBatch();
      } catch (err) {
        this.logger.error({ msg: "Batch error:", obj: err });
      }
      await this.sleep(this.pollInterval);
    }
  }

  stop(): void {
    this.isRunning = false;
    console.log("Stopped");
  }

  private async processBatch(): Promise<void> {
    const entries = await this.outboxRepo.listPending(100);
    if (entries.length === 0) return;

    this.logger.info(`Processing ${entries.length} entries`);

    for (const entry of entries) {
      try {
        await this.mqttClient.publish(entry.topic, entry.payload, { qos: 1 });
        await this.outboxRepo.markAsPublished(entry.id);
        this.logger.info({ msg: `Tx [${entry.topic}]:`, obj: entry.payload });
      } catch (err: any) {
        this.logger.error({ msg: `Failed to publish id=${entry.id}`, obj: err });
        await this.outboxRepo.markAsFailed(entry.id);
      }
    }
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
