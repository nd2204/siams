import { DeviceEvent, DeviceEventType } from "@domain/entities/device-event";
import { IDeviceEventPublisher, PublishDeviceEventOpts } from "@domain/services/device-event-publisher";
import { IDeviceEventRepository } from "@domain/repositories";
import { DomainEvent, IEventBus } from "@domain/interfaces/events";
import { ILogger } from "@shared/interfaces";
import { v4 as uuidv4 } from "uuid";
import { ICryptoService } from "@domain/services/crypto-service";
import { IOutboxRepository } from "@domain/repositories/outbox-repo";
import { OutboxTypeConstants } from "@domain/entities/outbox";
import { DeviceEventPayload } from "@domain/events/event-map";

export class DeviceEventPublisher implements IDeviceEventPublisher {
  constructor(
    private readonly deviceEventRepo: IDeviceEventRepository,
    private readonly eventBus: IEventBus,
    private readonly cryptoService: ICryptoService,
    private readonly outboxRepo: IOutboxRepository,
    private readonly logger: ILogger
  ) { }

  async publish<T extends DeviceEventType>(
    event: DomainEvent<DeviceEventPayload<T>>,
    opts?: PublishDeviceEventOpts
  ): Promise<DeviceEvent | null> {
    const event_payload = event.event_payload
    try {
      let savedEvent: DeviceEvent | null = null;
      // 1. Store event if requested
      if (opts && opts.store_event) {
        this.logger.info({ obj: { event, opts } });
        // 1.1. Calculate data hash if not provided
        const obj = JSON.parse(opts.store_event.raw_payload!);
        const data_hash = this.cryptoService.hash_canonicalize(obj);

        // 1.2. Persist to database
        savedEvent = await this.deviceEventRepo.create({
          event_uuid: uuidv4(),
          device_id: event_payload.device_id,
          cluster_id: event_payload.cluster_id,
          org_id: event_payload.org_id,
          event_type: event.event_name as DeviceEventType,
          raw_payload: opts.store_event.raw_payload!,
          data_hash: data_hash,
          created_at: new Date(event.ts)
        });

        // 1.3. publish to outbox for anchoring (default)
        if (!!!opts.skip_publish) {
          await this.outboxRepo.create({
            type: OutboxTypeConstants.AnchorEvent,
            payload: savedEvent
          })
        }
      }

      // 2. Publish to event bus (domain event handler will broadcast to WS)
      // Map to appropriate domain event based on eventType
      await this.eventBus.publish(event);

      this.logger.info(`Device event published: ${event.event_name} for device ${event_payload.device_id}`);
      return savedEvent;
    } catch (error) {
      this.logger.error(`Failed to publish device event: ${error}`);
      throw error;
    }
  }
}
