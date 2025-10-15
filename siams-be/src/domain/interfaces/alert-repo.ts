import type { Alert } from "@domain/entities";

export interface IAlertRepository {
  listRecent(deviceId: string, limit?: number): Promise<Alert[]>;
  save(alert: Alert): Promise<void>;
}
