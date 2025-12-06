import EventEmitter from "events";
import { IEventBus, DomainEvent, IDomainEventHandler } from "@/domain/interfaces/events";

export class NodeEventBus implements IEventBus {
  private ee = new EventEmitter();

  async publish(event: DomainEvent): Promise<void> {
    // publish asynchronously, but don't block
    process.nextTick(() => this.ee.emit(event.event_name, event));
  }

  subscribe(event_name: string, handler: IDomainEventHandler): void {
    this.ee.on(event_name, (payload: any) => {
      try {
        const res = handler.handle(payload);
        if (res && typeof (res as Promise<any>).catch === "function") {
          (res as Promise<any>).catch((err) => console.error("event handler error:", err));
        }
      } catch (err) {
        console.error("event handler sync error:", err);
      }
    });
  }
}
