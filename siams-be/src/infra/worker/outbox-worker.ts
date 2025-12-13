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
    private readonly blockchainService: IBlockchainService,
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

  /**
   * Process single device event anchor from outbox.
   * Creates anchor from payload and publishes to blockchain.
   */
  private async process_anchor_event(entry: OutboxEntry): Promise<void> {
    if (!this.blockchainService) {
      this.logger.warn({
        msg: "Anchor service not available, skipping anchor",
        obj: { entry_id: entry.id },
      });
      await this.outboxRepo.markAsFailed(entry.id);
      return;
    }

    try {
      const {
        device_id,
        event_uuid,
        data_hash
      } = entry.payload;

      // Anchor device event: creates anchor off-chain and publishes to blockchain
      const result = await this.blockchainService.anchor_device_event({
        anchor_type: "device.event",
        aggregate_id: event_uuid,
        data_hash,
        publisher: device_id,
      });

      // Mark outbox entry as processed
      await this.outboxRepo.markAsPublished(entry.id);

      this.logger.info({
        msg: "Device event anchored",
        obj: {
          anchor_uuid: result.anchor_uuid,
          tx_hash: result.tx_hash,
          block_number: result.block_number,
        },
      });
    } catch (err: any) {
      this.logger.error({
        msg: "Failed to anchor device event",
        obj: { entry_id: entry.id, error: err.message },
      });
      await this.outboxRepo.markAsFailed(entry.id);
    }
  }

  /**
   * Process batch anchor from outbox.
   * Creates anchor from merkle root and publishes to blockchain.
   */
  private async process_anchor_batch(entry: OutboxEntry): Promise<void> {
    if (!this.blockchainService) {
      this.logger.warn({
        msg: "Anchor service not available, skipping batch anchor",
        obj: { entry_id: entry.id },
      });
      await this.outboxRepo.markAsFailed(entry.id);
      return;
    }

    try {
      const {
        batch_id,
        data_hash,
        publisher,
      } = entry.payload;

      // Anchor batch: creates anchor off-chain and publishes to blockchain
      const result = await this.blockchainService.anchor_batch({
        batch_id,
        data_hash,
        publisher,
      });

      // Mark outbox entry as processed
      await this.outboxRepo.markAsPublished(entry.id);

      this.logger.info({
        msg: "Batch anchored",
        obj: {
          anchor_uuid: result.anchor_uuid,
          batch_id: result.batch_id,
          tx_hash: result.tx_hash,
          block_number: result.block_number,
        },
      });
    } catch (err: any) {
      this.logger.error({
        msg: "Failed to anchor batch",
        obj: { entry_id: entry.id, error: err.message },
      });
      await this.outboxRepo.markAsFailed(entry.id);
    }
  }

  private async processBatch(): Promise<void> {
    const entries = await this.outboxRepo.listPending(100);
    if (entries.length === 0) return;

    this.logger.info(`Processing ${entries.length} entries`);

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
