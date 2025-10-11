// domain/entities/schedule.ts
export interface Schedule {
  action: { params?: Record<string, any>; type: string; };
  cron?: string; // or a time window
  deviceId: string;
  enabled: boolean;
  scheduleId: string;
}
