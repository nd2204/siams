/* WIP */

// import type { Telemetry } from "@domain/entities";
import type { Threshold } from "@domain/value-objects";

export interface IEventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  subscribe<T extends DomainEvent>(
    event_name: T["event_name"],
    handler: IDomainEventHandler<T>
  ): void;
}

export class DomainEvent<TPayload = any, TEventType extends string = string> {
  public readonly ts: number = Date.now();
  constructor(
    public readonly event_payload: TPayload,
    public readonly event_name: TEventType
  ) { }
}

export interface IDomainEventHandler<TEvent = DomainEvent> {
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
