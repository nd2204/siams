import { Entity } from "@domain/interfaces";

export class Cluster extends Entity<Cluster, string> {
  declare name: string
  declare orgId: string
  declare locName?: string
  declare description?: string
  declare createdAt?: Date
  declare geom?: object
}
