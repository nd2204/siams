export interface Device {
  id: string;
  name: string;
  geom: GeoJSON.Point;
  model: string; // MCU model: ESP32, Arduino, etc.
  cluster_id: string;
  status: "online" | "offline";
  fw_ver: string;
  last_seen_at: Date;
}
