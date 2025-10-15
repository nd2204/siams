import { IPaginated, IRequest } from '@shared/interfaces'
import { CreateClusterUC, GetClusterByIdUC, ListClusterUC } from '@feature/cluster'
import { Cluster } from '@domain/entities'

export default class ClusterController {
  constructor(
    private createCluster: CreateClusterUC,
    private getClusterById: GetClusterByIdUC,
    private listCluster: ListClusterUC
  ) { }

  async create(req: IRequest): Promise<Cluster> {
    const cluster = await this.createCluster.call(req.body)
    return cluster
  }

  async list(req: IRequest): Promise<IPaginated<Cluster>> {
    const params = req.params as Record<string, number> ?? {}
    const { page, perPage } = params as { page?: number; perPage?: number }
    const cluster = await this.listCluster.call(page, perPage)
    return cluster
  }

  async getById(req: IRequest): Promise<Cluster> {
    const cluster = await this.getClusterById.call(req.params?.id as string)
    return cluster
  }
}
