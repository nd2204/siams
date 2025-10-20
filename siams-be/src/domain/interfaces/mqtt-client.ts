export interface IMqttClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  publish(topic: string, payload: any): Promise<void>;
  subscribe(topic: string, handler: (payload: any, topic: string) => Promise<void>): void;
}
