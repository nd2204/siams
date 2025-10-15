import Entity from "@domain/entity";

export class Cluster extends Entity<Cluster, string> {
  declare name: string
  declare location?: string
  declare ownerId: string
}
