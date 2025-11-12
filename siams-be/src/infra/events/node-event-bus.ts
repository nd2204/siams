import EventEmitter from "events";
import { IEventBus, IDomainEvent, IDomainEventHandler } from "@/domain/interfaces/events";

export class NodeEventBus implements IEventBus {
  private ee = new EventEmitter();

  async publish(event: IDomainEvent): Promise<void> {
    // publish asynchronously, but don't block
    process.nextTick(() => this.ee.emit(event.name, event));
  }

  subscribe(eventName: string, handler: IDomainEventHandler): void {
    this.ee.on(eventName, (payload: any) => {
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
