import { DeviceEvent } from "@domain/entities/device-event";
import { IDeviceEventPublisher, PublishDeviceEventRequest } from "@domain/services/device-event-publisher";
import { IDeviceEventRepository } from "@domain/repositories";
import { IDomainEvent, IEventBus } from "@domain/interfaces/events";
import { ILogger, IValidator } from "@shared/interfaces";
import { v4 as uuidv4 } from "uuid";
import { DeviceTelemetryReceivedEvent } from "@domain/events/device-telemetry-received-event";
import { DeviceRegisteredEvent } from "@domain/events/device-registered-event";
import { DeviceStatusReceivedEvent } from "@domain/events/device-status-received-event";
import { ICryptoService } from "@domain/services/crypto-service";
import { IOutboxRepository } from "@domain/repositories/outbox-repo";
import { OutboxTypeConstants } from "@domain/entities/outbox";

export class DeviceEventPublisher implements IDeviceEventPublisher {
  constructor(
    private readonly deviceEventRepo: IDeviceEventRepository,
    private readonly eventBus: IEventBus,
    private readonly cryptoService: ICryptoService,
    private readonly outboxRepo: IOutboxRepository,
    private readonly validator: IValidator<PublishDeviceEventRequest>,
    private readonly logger: ILogger
  ) { }

  async publish(request: PublishDeviceEventRequest): Promise<DeviceEvent | null> {
    const { value, errors } = this.validator.validate(request);
    if (errors && errors.length > 0) {
      this.logger.error({ msg: "Invalid event request", obj: errors })
      return null;
    }

    try {
      let savedEvent: DeviceEvent | null = null;
      // 1. Store event if requested
      if (request.store_event) {
        this.logger.info({ obj: request });
        // 1.1. Calculate data hash if not provided
        const obj = JSON.parse(value.raw_payload!);
        const data_hash = this.cryptoService.hash_canonicalize(obj);

        // 1.2. Persist to database
        savedEvent = await this.deviceEventRepo.create({
          event_uuid: uuidv4(),
          device_id: value.device_id,
          cluster_id: value.cluster_id,
          org_id: value.org_id,
          event_type: value.event_type,
          raw_payload: value.raw_payload!,
          data_hash: data_hash,
          created_at: new Date().toISOString()
        });

        // 1.3. publish to outbox for anchoring
        await this.outboxRepo.create({
          type: OutboxTypeConstants.AnchorEvent,
          payload: savedEvent
        })
      }

      // 2. Publish to event bus (domain event handler will broadcast to WS)
      // Map to appropriate domain event based on eventType
      const domainEvent = this.mapToDomainEvent(value);
      if (domainEvent) {
        await this.eventBus.publish(domainEvent);
      }

      this.logger.info(`Device event published: ${value.event_type} for device ${request.device_id}`);
      return savedEvent;
    } catch (error) {
      this.logger.error(`Failed to publish device event: ${error}`);
      throw error;
    }
  }

  private mapToDomainEvent(request: PublishDeviceEventRequest): IDomainEvent | null {
    // Map to appropriate domain event type
    switch (request.event_type) {
      case "device.registered":
        return new DeviceRegisteredEvent(
          request.event_payload,
          request.org_id,
          request.cluster_id
        );
      case "device.status":
        return new DeviceStatusReceivedEvent(
          request.event_payload,
          request.org_id,
          request.device_id,
        );
      case "device.telemetry":
        return new DeviceTelemetryReceivedEvent(
          request.event_payload,
          request.org_id,
          request.device_id,
        )
      case "device.rule.triggered":
      default:
        this.logger.warn(`Unknown event type: ${request.event_type}`);
        return null;
    }
  }
}
