import { Entity } from "@domain/interfaces";

export class Cluster extends Entity<Cluster, string> {
  declare name: string
  declare location: string
  declare orgId: string
  declare description: string
  declare createdAt: Date
}
