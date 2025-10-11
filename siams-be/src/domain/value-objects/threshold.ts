export type Operator = 'gt' | 'gte' | 'lt' | 'lte';

export interface Threshold {
  action: { params?: Record<string, any>; type: string; }; // e.g., activate pump
  cooldownMs?: number; // domain rule to avoid flapping
  operator: Operator;
  sensorType: string;
  value: number;
}

