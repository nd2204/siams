import { Entity } from "@domain/interfaces";

const AnchorTypeConstants = {
  DEVICE_PROVENANCE: 'device.provenance',
  DEVICE_EVENT: 'device.event',
  DEVICE_TELEMETRY: 'device.telemetry',
  DEVICE_TELEMETRY_BATCH: 'device.telemetry.batch',
} as const;

export type AnchorType = typeof AnchorTypeConstants[keyof typeof AnchorTypeConstants]

export class Anchor extends Entity<Anchor, number> {
  declare anchor_uuid: string;
  declare anchor_type: AnchorType;
  declare aggregate_id?: string;
  declare data_hash: string;
  declare batch_id?: string
  declare publisher?: string;
  declare tx_hash?: string;
  declare block_number?: bigint;
  declare status: string;
  declare sent_at?: Date;
  declare created_at: Date;
} 
