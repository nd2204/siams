export type Operator = 'gt' | 'gte' | 'lt' | 'lte';

export default interface Threshold {
  action: { params?: Record<string, unknown>; type: string; }; // e.g., activate pump
  cooldownMs?: number; // domain rule to avoid flapping
  operator: Operator;
  sensorType: string;
  value: number;
}

