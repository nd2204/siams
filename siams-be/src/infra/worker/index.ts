import { OutboxWorker } from "./outbox-worker";
import { SMLogger } from "@shared/logger";
import { services } from "@config/services";

export const outboxWorker = new OutboxWorker(
  services.outbox.repository,
  new SMLogger("infra:worker:OutboxWorker")
)
