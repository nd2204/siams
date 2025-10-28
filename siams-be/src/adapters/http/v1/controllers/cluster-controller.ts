import { IPaginated, IRequest } from '@shared/interfaces'
import { GetClusterByIdUC } from '@feature/cluster/get-by-id'
import { ListDeviceByClusterIdUC } from '@feature/device/list-devices-by-cluster-id'
import { Cluster, Device } from '@domain/entities'
import { ListDeviceByClusterIdRequest } from '@feature/device/dtos/list-devices-by-cluster-id-request'
import { GetClusterByIdRequest } from '@feature/cluster/dtos/get-cluster-by-id-request'

export class ClusterController {
  constructor(
    private getClusterByIdUC: GetClusterByIdUC,
    private listDeviceByClusterIdUC: ListDeviceByClusterIdUC
  ) { }

  async getById(req: IRequest): Promise<Cluster> {
    const request: GetClusterByIdRequest = {
      token: req.token,
      clusterId: req.params?.id as string
    }
    return await this.getClusterByIdUC.call(request)
  }

  async listDevices(req: IRequest): Promise<IPaginated<Device>> {
    const request: ListDeviceByClusterIdRequest = {
      token: req.token,
      clusterId: req.params?.id as string,
      page: req.body?.page as number,
      perPage: req.body?.perPage as number,
    }
    return await this.listDeviceByClusterIdUC.call(request)
  }
}
