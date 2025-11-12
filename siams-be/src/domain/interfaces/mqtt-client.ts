export interface IMqttPubOption {
  qos?: 0 | 1 | 2,
  retained?: boolean
}

export interface IMqttClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  publish(topic: string, payload: any, opts?: IMqttPubOption): Promise<void>;
  subscribe(topic: string, handler: (payload: any, topic: string) => Promise<void>): void;
}
