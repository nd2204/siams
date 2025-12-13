import { services } from "@config/services";
import { SMLogger } from "@shared/logger";
import { OutboxWorker } from "./outbox-worker";

// Create outbox worker only if anchor service is available
export const outboxWorker = new OutboxWorker(
  services.outbox.repository,
  services.blockchain.services.blockchain,
  new SMLogger("infra:worker:OutboxWorker")
)

