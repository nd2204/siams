import { Anchor } from "@domain/entities/anchor";
import { PostgresRepositoryBase } from "../postgres-repo-base";
import { IAnchorRepository } from "@domain/repositories/anchor-repo";
import { Pool } from "pg";

export class AnchorRepositoryPg
  extends PostgresRepositoryBase<Anchor>
  implements IAnchorRepository {

  constructor(pool: Pool) {
    const mapping: Record<keyof Anchor, string> = {
      anchor_uuid: "anchor_uuid",
      anchor_type: "anchor_type",
      aggregate_id: "aggregate_id",
      data_hash: "data_hash",
      batch_id: "batch_id",
      publisher: "publisher",
      tx_hash: "tx_hash",
      block_number: "block_number",
      status: "status",
      sent_at: "sent_at",
      created_at: "created_at",
      id: "id"
    }
    super(pool, "anchors", mapping, (row) => {
      return new Anchor({
        anchor_uuid: row[mapping.anchor_uuid],
        anchor_type: row[mapping.anchor_type],
        aggregate_id: row[mapping.aggregate_id],
        data_hash: row[mapping.data_hash],
        batch_id: row[mapping.batch_id],
        publisher: row[mapping.publisher],
        tx_hash: row[mapping.tx_hash],
        block_number: row[mapping.block_number],
        status: row[mapping.status],
        sent_at: row[mapping.sent_at],
        created_at: row[mapping.created_at],
        id: row[mapping.id]
      })
    })
  }
}
