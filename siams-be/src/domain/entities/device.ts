// import { ActuationIntent, ThresholdEvaluatorService } from "@domain/services/threshold-evaluator";
// import { Threshold, Schedule } from "@domain/value-objects";
import { Entity } from "@domain/interfaces";
import { Cluster } from "./cluster";
import { Organization } from "./organization";

export class Device extends Entity<Device, string> {

  // metadata
  declare name?: string;
  declare model: string;
  declare fw_ver: string;
  declare deleted?: boolean;

  // device identity
  declare org_id: Organization["id"];
  declare cluster_id?: Cluster["id"];
  declare hardware_id: string;

  // Trust & provenance
  declare trust_level: 'SIGNED' | 'SECRET' | 'PROVCODE' | 'EPHEMERAL';
  declare pubkey?: string;
  declare device_secret?: string
  declare prov_onchain?: boolean;
  declare prov_status?: "PROVISIONED" | "PENDING" | "REVOKED"

  // Status
  declare status: 'offline' | 'online' | 'unregistered';
  declare last_seen_at?: Date;

  // Audit
  declare created_at?: Date;
  declare updated_at?: Date;

  // Geospatial
  declare geom: object; // geojson

  constructor(opts: Device) {
    super(opts);
    this.name = opts.name ?? `${opts.model}-${this.fw_ver}`;
  }

  static markOffline(): Partial<Device> {
    return {
      status: 'offline',
    }
  }

  static markSeen(ts: Date = new Date()): Partial<Device> {
    return {
      last_seen_at: ts,
      status: 'online',
    }
  }

  // updateThreshold(sensorType: string, newT: Threshold) {
  //   // validate domain invariants (range, operator)
  //   const idx = this.thresholds.findIndex(t => t.sensorType === sensorType);
  //   if (idx >= 0) this.thresholds[idx] = newT;
  //   else this.thresholds.push(newT);
  // }
}
