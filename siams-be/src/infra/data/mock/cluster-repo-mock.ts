import { Cluster } from "@domain/entities";
import { IClusterRepository } from "@domain/repositories";
import { IPaginated } from "@shared/interfaces";

const clusters: Cluster[] = []

export class ClusterRepositoryMock implements IClusterRepository {

  constructor() { }

  addDevice(deviceId: string, clusterId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  removeDevice(deviceId: string, clusterId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  findOneBy(filters: Partial<Cluster>): Promise<Cluster | undefined> {
    return new Promise((resolve) => resolve(clusters.find(
      c =>
        filters.id ? (c.id === filters.id) : true &&
          filters.name ? (c.name === filters.name) : true &&
            filters.location ? (c.location === filters.location) : true &&
              filters.orgId ? (c.orgId === filters.orgId) : true
    )))
  }
  findAllBy(filters: Partial<Cluster>): Promise<Cluster[]> {
    throw new Error("Method not implemented.");
  }
  listBy(filters: Partial<Cluster>, page: number, perPage: number): Promise<IPaginated<Cluster>> {
    throw new Error("Method not implemented.");
  }
  create(payload: Partial<Cluster>): Promise<Cluster> {
    return new Promise((resolve) => {
      const cluster = payload as Cluster
      clusters.push(cluster);
      resolve(cluster)
    })
  }
  update(id: number | string, payload: Partial<Cluster>): Promise<Cluster> {
    throw new Error("Method not implemented.");
  }
  delete(id: number | string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}
