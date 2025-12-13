import { Anchor } from "@domain/entities/anchor";
import { IAnchorRepository } from "@domain/repositories/anchor-repo";
import { IBlockchainService } from "@domain/services/blockchain-service";
import { IUseCase, IValidator } from "@shared/interfaces";
import { ValidationError } from "@shared/errors";
import { v4 as uuidv4, v4} from'uuid'

/**
 * Request for anchoring a batch of device events (merkle root).
 */
export interface AnchorBatchRequest {
  batch_id: string; // unique batch identifier
  merkle_root: string; // hex string of merkle root
  publisher: string; // organization ID
  batch_size: number; // number of events in batch
}

/**
 * Response from batch anchoring operation.
 */
export interface AnchorBatchResult {
  tx_hash: string;
  block_number: bigint;
  anchor_uuid: string;
  batch_id: string;
}

/**
 * Use case for anchoring batch of device events (merkle root) to blockchain.
 * Aggregates multiple device events into single merkle root for efficient on-chain storage.
 */
export class AnchorBatchUC implements IUseCase<AnchorBatchResult> {
  constructor(
    private readonly anchorRepo: IAnchorRepository,
    private readonly blockchainService: IBlockchainService,
    private readonly validator: IValidator<AnchorBatchRequest>
  ) {}

  async call(req: AnchorBatchRequest): Promise<AnchorBatchResult> {
    // Validate request
    const { value, errors } = this.validator.validate(req);
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid batch anchor request", errors);
    }

    // Create anchor entity with merkle root
    const anchor = new Anchor({
      anchor_uuid: v4(),
      batch_id: value.batch_id,
      anchor_type: "device.telemetry.batch",
      data_hash: value.merkle_root, // merkle root stored as data_hash
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
        anchor_uuid: saved.anchor_uuid,
        batch_id: value.batch_id,
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
