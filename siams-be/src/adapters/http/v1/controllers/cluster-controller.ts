import { IRequest } from '@shared/interfaces'
import { GetClusterByIdUC } from '@feature/cluster'
import { Cluster } from '@domain/entities'

export class ClusterController {
  constructor(
    private getClusterByIdUC: GetClusterByIdUC,
  ) { }

  async getById(req: IRequest): Promise<Cluster> {
    const cluster = await this.getClusterByIdUC.call(
      req.params?.id as string
    )
    return cluster
  }
}
