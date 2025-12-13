import { IBlockchainService, AnchorDeviceEventCommand, AnchorBatchCommand, AnchorDeviceEventResult, AnchorBatchResult } from "@domain/services/blockchain-service";
import { Anchor } from "@domain/entities/anchor";
import { IAnchorRepository } from "@domain/repositories/anchor-repo";
import { ethers } from "ethers";
import IoTAnchoringAbi from "./abi/IoTAnchoringAbi.json";
import { ILogger } from "@shared/interfaces";
import { randomUUID } from "crypto";
import { IAppConfig } from "@domain/interfaces/config";

/**
 * Ethereum/Polygon implementation of unified anchor service.
 * Handles complete anchor lifecycle: creation, persistence, and blockchain publication.
 */
export class EthereumBlockchainService implements IBlockchainService {
  private contract: ethers.Contract;

  constructor(
    private readonly provider: ethers.JsonRpcProvider,
    private readonly signer: ethers.Signer,
    private readonly anchorRepository: IAnchorRepository,
    private readonly config: IAppConfig,
    private readonly logger: ILogger
  ) {
    this.contract = new ethers.Contract(
      this.config.blockchain.contractAddr,
      IoTAnchoringAbi,
      signer
    );
  }

  /**
   * Anchor a single device event.
   * Creates the anchor off-chain and publishes it to blockchain.
   */
  async anchor_device_event(command: AnchorDeviceEventCommand): Promise<AnchorDeviceEventResult> {
    try {
      // Persist anchor to database
      const savedAnchor = await this.anchorRepository.create({
        anchor_uuid: randomUUID(),
        anchor_type: command.anchor_type,
        aggregate_id: command.aggregate_id,
        data_hash: command.data_hash,
        publisher: command.publisher,
        status: "PENDING",
        created_at: new Date(),
      });

      // Publish to blockchain
      const result = await this.publish_anchor_to_blockchain_device_event(savedAnchor);

      // Update anchor with blockchain transaction details
      await this.anchorRepository.update(savedAnchor.id, {
        tx_hash: result.tx_hash,
        block_number: result.block_number,
        status: "SENT",
        sent_at: new Date(),
      });

      this.logger.info({
        msg: "Device event anchored successfully",
        obj: {
          anchor_uuid: savedAnchor.anchor_uuid,
          tx_hash: result.tx_hash,
          block_number: result.block_number,
        },
      });

      return {
        anchor_uuid: savedAnchor.anchor_uuid,
        tx_hash: result.tx_hash,
        block_number: result.block_number,
      };
    } catch (err) {
      this.logger.error({
        msg: "Failed to anchor device event",
        obj: { error: (err as Error).message, command },
      });
      throw err;
    }
  }

  /**
   * Anchor a batch of device events (merkle root).
   * Creates the anchor off-chain and publishes it to blockchain.
   */
  async anchor_batch(command: AnchorBatchCommand): Promise<AnchorBatchResult> {
    try {
      // Create anchor entity for batch
      const anchor = new Anchor({
        anchor_uuid: randomUUID(),
        anchor_type: "device.telemetry.batch" as any,
        batch_id: command.batch_id,
        data_hash: command.data_hash,
        publisher: command.publisher,
        status: "PENDING",
        created_at: new Date(),
      });

      // Persist anchor to database
      const savedAnchor = await this.anchorRepository.create(anchor);

      // Publish to blockchain
      const result = await this.publish_anchor_to_blockchain_batch(savedAnchor);

      // Update anchor with blockchain transaction details
      await this.anchorRepository.update(savedAnchor.id, {
        tx_hash: result.tx_hash,
        block_number: result.block_number,
        status: "SENT",
        sent_at: new Date(),
      });

      this.logger.info({
        msg: "Batch anchored successfully",
        obj: {
          anchor_uuid: savedAnchor.anchor_uuid,
          batch_id: command.batch_id,
          tx_hash: result.tx_hash,
          block_number: result.block_number,
        },
      });

      return {
        anchor_uuid: savedAnchor.anchor_uuid,
        batch_id: command.batch_id,
        tx_hash: result.tx_hash,
        block_number: result.block_number,
      };
    } catch (err) {
      this.logger.error({
        msg: "Failed to anchor batch",
        obj: { error: (err as Error).message, command },
      });
      throw err;
    }
  }

  /**
   * Check if anchor service is available (blockchain connection active).
   */
  is_available(): boolean {
    return this.provider !== null && this.signer !== null;
  }

  /**
   * Publish anchor to blockchain based on anchor type.
   * Handles both single device events and batch merkle roots.
   * @deprecated Use anchor_device_event or anchor_batch instead for complete anchor lifecycle handling.
   */
  async publish_anchor(anchor: Anchor): Promise<{ tx_hash: string; block_number: bigint }> {
    try {
      switch (anchor.anchor_type) {
        case "device.provenance":
        case "device.event":
          return await this.publish_anchor_to_blockchain_device_event(anchor);

        case "device.telemetry.batch":
          return await this.publish_anchor_to_blockchain_batch(anchor);

        default:
          throw new Error(`Unsupported anchor type: ${anchor.anchor_type}`);
      }
    } catch (err) {
      this.logger.error({
        msg: "Failed to publish anchor",
        obj: {
          anchor_id: anchor.id,
          error: (err as Error).message
        },
      });
      throw err;
    }
  }

  /**
   * Publish individual device event anchor to blockchain.
   * Emits DeviceEventAnchored event.
   */
  private async publish_anchor_to_blockchain_device_event(
    anchor: Anchor
  ): Promise<{ tx_hash: string; block_number: bigint }> {
    this.logger.debug({
      msg: "Publishing device event to blockchain",
      obj: {
        anchor_id: anchor.id,
        type: anchor.anchor_type
      },
    });

    // Convert IDs to bytes32 format (pad hex strings to 32 bytes)
    const deviceId = this.stringToBytes32(anchor.aggregate_id || "");
    const dataHash = this.stringToBytes32(anchor.data_hash);
    const orgId = this.stringToBytes32(anchor.publisher || "");

    const action = anchor.anchor_type || "device.event";
    const timestamp = Math.floor(Date.now() / 1000);

    try {
      const tx = await this.contract.anchorDeviceEvent(
        deviceId,
        dataHash,
        orgId,
        action,
        timestamp
      );

      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error("Transaction receipt is null");
      }

      this.logger.info({
        msg: "Device event published to blockchain",
        obj: {
          anchor_id: anchor.id,
          tx_hash: receipt.hash,
          block_number: receipt.blockNumber,
        },
      });

      return {
        tx_hash: receipt.hash,
        block_number: BigInt(receipt.blockNumber),
      };
    } catch (err) {
      this.logger.error({
        msg: "Device event blockchain publication failed",
        obj: {
          anchor_id: anchor.id,
          error: (err as Error).message,
        },
      });
      throw err;
    }
  }

  /**
   * Publish batch merkle root to blockchain.
   * Emits BatchAnchored event.
   */
  private async publish_anchor_to_blockchain_batch(
    anchor: Anchor
  ): Promise<{ tx_hash: string; block_number: bigint }> {
    this.logger.debug({
      msg: "Publishing batch to blockchain",
      obj: { anchor_id: anchor.id, batch_id: anchor.batch_id },
    });

    // data_hash contains the merkle root
    const merkleRoot = anchor.data_hash;
    const orgId = this.stringToBytes32(anchor.publisher || "");
    const batchSize = BigInt(anchor.batch_id?.split("_")[1] || "1"); // Extract count from batch_id
    const timestamp = Math.floor(Date.now() / 1000);

    try {
      const tx = await this.contract.anchorBatch(
        merkleRoot,
        orgId,
        batchSize,
        timestamp
      );

      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error("Transaction receipt is null");
      }

      this.logger.info({
        msg: "Batch published to blockchain",
        obj: {
          anchor_id: anchor.id,
          batch_id: anchor.batch_id,
          tx_hash: receipt.hash,
          block_number: receipt.blockNumber,
        },
      });

      return {
        tx_hash: receipt.hash,
        block_number: BigInt(receipt.blockNumber),
      };
    } catch (err) {
      this.logger.error({
        msg: "Batch blockchain publication failed",
        obj: {
          anchor_id: anchor.id,
          batch_id: anchor.batch_id,
          error: (err as Error).message,
        },
      });
      throw err;
    }
  }

  /**
   * Convert string to bytes32 format for Ethereum.
   * Pads hex strings to 32 bytes (64 hex chars).
   */
  private stringToBytes32(str: string): string {
    let hex = str.startsWith("0x") ? str : "0x" + str;
    // Ensure it's a valid hex string
    if (!/^0x[0-9a-fA-F]*$/.test(hex)) {
      hex = "0x" + Buffer.from(str).toString("hex");
    }
    // Pad to 32 bytes (64 hex chars + 0x prefix)
    return ethers.zeroPadValue(hex, 32);
  }
}

