const AnchorTypeConstants = {
  DEVICE_PROVENANCE: 'device.provenance',
  DEVICE_EVENT: 'device.event',
  DEVICE_TELEMETRY: 'device.telemetry',
  DEVICE_TELEMETRY_BATCH: 'device.telemetry.batch',
} as const;

type AnchorType = typeof AnchorTypeConstants[keyof typeof AnchorTypeConstants]

export interface Anchor {
  anchor_uuid: string,
  anchor_type: AnchorType,
  aggregate_id?: string,
  data_hash: string,
  batch_id?: string,
  publisher?: string,
  tx_hash?: string,
  block_number?: bigint,
  status: string,
  sent_at?: Date,
  created_at: Date
}
