import { Anchor, AnchorType } from "@domain/entities/anchor";
import { IAnchorRepository } from "@domain/repositories/anchor-repo";
import { IBlockchainService } from "@domain/services/blockchain-service";
import { IUseCase, IValidator } from "@shared/interfaces";
import { ValidationError } from "@shared/errors";
import { randomUUID } from "crypto";

/**
 * Request for anchoring a single device event (provenance, event, telemetry, etc).
 */
export interface AnchorDeviceEventRequest {
  anchor_uuid: string;
  anchor_type: AnchorType; // 'device.provenance', 'device.event', 'device.telemetry'
  aggregate_id: string; // device ID
  data_hash: string; // hash of device data
  publisher: string; // organization ID
}

/**
 * Response from anchoring operation.
 */
export interface AnchorResult {
  tx_hash: string;
  block_number: bigint;
  anchor_uuid: string;
}

/**
 * Use case for anchoring single device events to blockchain.
 * Persists anchor to database and publishes to blockchain.
 */
export class AnchorDeviceEventUC implements IUseCase<AnchorResult> {
  constructor(
    private readonly anchorRepo: IAnchorRepository,
    private readonly blockchainService: IBlockchainService,
    private readonly validator: IValidator<AnchorDeviceEventRequest>
  ) {}

  async call(req: AnchorDeviceEventRequest): Promise<AnchorResult> {
    // Validate request
    const { value, errors } = this.validator.validate(req);
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid anchor request", errors);
    }

    // Create anchor entity
    const anchor = new Anchor({
      anchor_uuid: value.anchor_uuid,
      anchor_type: value.anchor_type,
      aggregate_id: value.aggregate_id,
      data_hash: value.data_hash,
      publisher: value.publisher,
      status: "PENDING",
      created_at: new Date(),
    });

    // Persist to database
    const saved = await this.anchorRepo.create(anchor);

    try {
      // Publish to blockchain
      const result = await this.blockchainService.publish_anchor(saved);

      // Update anchor with tx hash and block number
      saved.tx_hash = result.tx_hash;
      saved.block_number = result.block_number;
      saved.status = "SENT";
      saved.sent_at = new Date();

      await this.anchorRepo.update(saved.id, {
        tx_hash: result.tx_hash,
        block_number: result.block_number,
        status: "SENT",
        sent_at: new Date(),
      });

      return {
        tx_hash: result.tx_hash,
        block_number: result.block_number,
        anchor_uuid: saved.anchor_uuid
      };
    } catch (err) {
      // Mark anchor as failed in database
      await this.anchorRepo.update(saved.id, {
        status: "FAILED",
      });
      throw err;
    }
  }
}
