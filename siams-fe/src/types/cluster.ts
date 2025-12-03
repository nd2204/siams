import type { Device } from "./device/index";
import type { IPaginated } from "./paginated";

export interface Cluster {
  id: string;
  name: string;
  locName: string;
  geom?: GeoJSON.Feature;
  devices?: IPaginated<Device>;
  coordinates: { x: number; y: number };
  credentials?: {
    loginId: string;
    password: string;
    createdAt: string;
  };
}
