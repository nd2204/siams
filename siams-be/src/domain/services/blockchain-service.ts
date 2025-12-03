import { Anchor } from "@domain/entities/anchor";

export interface IBlockchainService {
  publish_anchor(anchor: Anchor): Promise<{ tx_hash: string, block_number: bigint }>
  is_available(): boolean;
}
