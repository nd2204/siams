// src/infra/workers/OutboxWorker.ts
import { IMqttClient } from "@/domain/interfaces";
import { topics } from "@config/mqtt-topics";
import { IOutboxRepository } from "@domain/repositories/outbox-repo";
import { ILogger } from "@shared/interfaces";

export class OutboxWorker {
  private isRunning = false;

  constructor(
    private readonly outboxRepo: IOutboxRepository,
    private readonly mqttClient: IMqttClient,
    private readonly logger: ILogger,
    private readonly pollInterval = 3000
  ) { }

  async start(): Promise<void> {
    if (this.isRunning) return;
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
      const { orgId, clusterId, deviceId } = entry.payload;
      try {
        const topic = topics.deviceCommand.create({
          orgId,
          clusterId,
          deviceId
        });
        await this.mqttClient.publish(topic, entry.payload);
        await this.outboxRepo.markAsPublished(entry.id);
        this.logger.info(`Tx [${entry.topic}]: ${entry.payload}`);
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
