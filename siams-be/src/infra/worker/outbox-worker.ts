// src/infra/workers/OutboxWorker.ts
import { IMqttClient } from "@/domain/interfaces";
import { OutboxEntry } from "@domain/entities";
import { IOutboxRepository } from "@domain/repositories/outbox-repo";
import { IBlockchainService } from "@domain/services/blockchain-service";
import { ILogger } from "@shared/interfaces";

export class OutboxWorker {
  private isRunning = false;
  private mqttClient: IMqttClient;

  constructor(
    private readonly outboxRepo: IOutboxRepository,
    // private readonly blockchainService: IBlockchainService,
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

  private async process_command_outbox(entry: OutboxEntry): Promise<void> {
    const topic = entry.payload.topic;
    const payload = entry.payload.data;
    try {
      await this.mqttClient.publish(topic, payload, { qos: 1 });
      await this.outboxRepo.markAsPublished(entry.id);
      this.logger.info({ msg: `Tx [${topic}]:`, obj: payload });
    } catch (err: any) {
      this.logger.error({ msg: `Failed to publish id=${entry.id}`, obj: err });
      await this.outboxRepo.markAsFailed(entry.id);
    }
  }

  private async process_anchor_event(entry: OutboxEntry): Promise<void> {
    // this.logger.info({ obj: entry.payload });
    // throw new UnimplementedError(this.process_anchor_event.name);
  }

  private async process_anchor_batch(entry: OutboxEntry): Promise<void> {
    // this.logger.info({ obj: entry.payload });
    // throw new UnimplementedError(this.process_anchor_batch.name);
  }

  private async processBatch(): Promise<void> {
    const entries = await this.outboxRepo.listPending(100);
    if (entries.length === 0) return;

    // this.logger.info(`Processing ${entries.length} entries`);

    for (const entry of entries) {
      switch (entry.type) {
        case 'device.command': await this.process_command_outbox(entry); break;
        case 'anchor.batch': await this.process_anchor_batch(entry); break;
        case 'anchor.event': await this.process_anchor_event(entry); break;
      }
    }
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
