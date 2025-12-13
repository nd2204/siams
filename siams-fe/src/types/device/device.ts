import type { Cluster } from "../cluster";
import type { Organization } from "../organization";

export interface Device {
  id: string;
  name: string;
  // device identity
  hardware_id: string;
  geom: GeoJSON.Point;
  model: string; // MCU model: ESP32, Arduino, etc.
  org_id: Organization["id"];
  cluster_id?: Cluster["id"];
  fw_ver: string;
  deleted?: boolean;

  // Trust & provenance
  trust_level: 'SIGNED' | 'SECRET' | 'PROVCODE' | 'EPHEMERAL';
  pubkey?: string;
  device_secret?: string
  prov_onchain?: boolean;
  prov_status?: "PROVISIONED" | "PENDING" | "REVOKED"

  // Status
  status: 'offline' | 'online' | 'unregistered';
  last_seen_at: Date;

  // Audit
  created_at?: Date;
  updated_at?: Date;
}

export type DeviceFeatureProperties = {
  id: string;
  name: string;
  hardware_id: string;
  model: string;
  org_id: string;
  cluster_id?: string;
  fw_ver: string;
  trust_level: Device["trust_level"];
  status: Device["status"];
  last_seen_at: string; // ISO
};

import type { Feature, FeatureCollection, Point } from "geojson";

export function devicesToFeatureCollection(
  devices: Device[]
): FeatureCollection<Point, DeviceFeatureProperties> {
  return {
    type: "FeatureCollection",
    features: devices
      .filter(d => !d.deleted)
      .map<Feature<Point, DeviceFeatureProperties>>(d => ({
        type: "Feature",
        geometry: d.geom,
        properties: {
          id: d.id,
          name: d.name,
          hardware_id: d.hardware_id,
          model: d.model,
          org_id: d.org_id,
          cluster_id: d.cluster_id,
          fw_ver: d.fw_ver,
          trust_level: d.trust_level,
          status: d.status,
          last_seen_at: d.last_seen_at.toISOString()
        }
      }))
  };
}
