import type { Alert } from "@domain/entities/alert.js";

export interface AlertRepository {
  listRecent(deviceId: string, limit?: number): Promise<Alert[]>;
  save(alert: Alert): Promise<void>;
}
