/* WIP */

// import type { Telemetry } from "@domain/entities";
import type { Threshold } from "@domain/value-objects";

export interface IEventBus {
  publish<T extends IDomainEvent>(event: T): Promise<void>;
  subscribe<T extends IDomainEvent>(
    eventName: T["name"],
    handler: IDomainEventHandler<T>
  ): void;
}

export interface IDomainEvent<TPayload = any> {
  name: string,
  ts: number,
  payload: TPayload
}

export interface IDomainEventHandler<TEvent = IDomainEvent> {
  handle(event: TEvent): Promise<void>
}

export interface CommandAckedEvent {
  commandId: string;
  deviceId: string;
}

export interface TelemetryReceivedEvent {
  deviceId: string;
  // telemetry: Telemetry;
}

export interface ThresholdBreachedEvent {
  deviceId: string;
  reading: number;
  threshold: Threshold;
}
