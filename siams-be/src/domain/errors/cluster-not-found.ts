import { Cluster } from "@domain/entities";
import { NotFoundError } from "@shared/errors";
import { IError } from "@shared/interfaces";

export class ClusterNotFoundError extends NotFoundError implements IError {
  details?: unknown;

  constructor(cluster_id: Cluster["id"], details?: any) {
    super(`Cluster with id=${cluster_id} not found`);
    this.details = details;
  }
}
