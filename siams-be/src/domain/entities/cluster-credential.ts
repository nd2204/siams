import { Entity } from "@domain/interfaces";

export class ClusterCredential extends Entity<ClusterCredential, string> {
  declare clusterId: string;
  declare loginId: string;
  declare password: string;
  declare salt: string;
  declare createdAt?: Date;
}
