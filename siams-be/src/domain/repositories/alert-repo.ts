import type { Alert } from "@domain/entities";
import { IRepository } from "@shared/interfaces";

export interface IAlertRepository extends IRepository<Alert> {
  listRecent(deviceId: string, limit?: number): Promise<Alert[]>;
  save(alert: Alert): Promise<void>;
}
