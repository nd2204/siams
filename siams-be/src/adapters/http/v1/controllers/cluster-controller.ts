import { IRequest } from '@shared/interfaces'
import { GetClusterByIdUC } from '@feature/cluster'
import { Cluster } from '@domain/entities'

export default class ClusterController {
  constructor(
    private getClusterById: GetClusterByIdUC,
  ) { }

  async getById(req: IRequest): Promise<Cluster> {
    const cluster = await this.getClusterById.call(
      req.params?.id as string
    )
    return cluster
  }
}
