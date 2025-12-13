import { Anchor, AnchorType } from "@domain/entities/anchor";

/**
 * Command for anchoring a single device event.
 */
export interface AnchorDeviceEventCommand {
  anchor_type: "device.provenance" | "device.event" | "device.telemetry";
  aggregate_id: string; // event id
  data_hash: string; // hash of device data
  publisher: string; // device id
}

/**
 * Command for anchoring a batch of device events (merkle root).
 */
export interface AnchorBatchCommand {
  batch_id: string;
  data_hash: string; // merkle root as hex string
  publisher: string; // device id
}

/**
 * Response from device event anchoring operation.
 */
export interface AnchorDeviceEventResult {
  anchor_uuid: string;
  tx_hash: string;
  block_number: bigint;
}

/**
 * Response from batch anchoring operation.
 */
export interface AnchorBatchResult {
  anchor_uuid: string;
  batch_id: string;
  tx_hash: string;
  block_number: bigint;
}

/**
 * Unified blockchain anchor service.
 * Handles the complete anchor lifecycle: creation, persistence, and blockchain publication.
 */
export interface IBlockchainService {
  /**
   * Anchor a single device event.
   * Creates the anchor off-chain and publishes it to blockchain in one operation.
   */
  anchor_device_event(command: AnchorDeviceEventCommand): Promise<AnchorDeviceEventResult>;

  /**
   * Anchor a batch of device events (merkle root).
   * Creates the anchor off-chain and publishes it to blockchain in one operation.
   */
  anchor_batch(command: AnchorBatchCommand): Promise<AnchorBatchResult>;

  /**
   * Check if anchor service is available (blockchain connection active).
   */
  is_available(): boolean;

  /**
   * @deprecated Use anchor_device_event or anchor_batch instead.
   * Publishes an existing anchor to blockchain.
   */
  publish_anchor(anchor: Anchor): Promise<{ tx_hash: string, block_number: bigint }>
}
