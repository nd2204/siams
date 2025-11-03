export default interface Schedule {
  action: { params?: Record<string, unknown>; type: string; };
  cron?: string; // or a time window
  deviceId: string;
  enabled: boolean;
  scheduleId: string;
}
