import { IPaginated, IRequest } from '@shared/interfaces'
import { Cluster, Device, Organization } from '@domain/entities'
import { CreateOrganizationRequest, CreateOrganizationResponse } from '@feature/organization/dtos';
import { CreateOrganizationUC } from '@feature/organization/create-org';
import { GetOrganizationByIdUC } from '@feature/organization/get-org-by-id';
import { GetClusterByIdUC } from '@feature/cluster/get-by-id';
import { ListClusterByOrgIdUC } from '@feature/cluster/list-clusters-by-org-id';
import { GetClusterByIdRequest } from '@feature/cluster/dtos/get-cluster-by-id-request';
import { ListClusterByOrgIdRequest } from '@feature/cluster/dtos/list-cluster-by-org-id-request';
import { ListDeviceByOrgIdUC } from '@feature/device/list-by-org-id';

export class OrganizationController {

  constructor(
    private createOrgUC: CreateOrganizationUC,
    private getOrgByIdUC: GetOrganizationByIdUC,
    private getClusterByIdUC: GetClusterByIdUC,
    private listClusterByOrgIdUC: ListClusterByOrgIdUC,
    private listDeviceByOrgIdUC: ListDeviceByOrgIdUC
  ) { }

  async create(req: IRequest): Promise<CreateOrganizationResponse> {
    const request: CreateOrganizationRequest = {
      token: req.token,
      slug: req.body?.slug,
      name: req.body?.name,
      userId: req.body?.userId
    }
    return await this.createOrgUC.call(request);
  }

  async getById(req: IRequest): Promise<Organization> {
    return await this.getOrgByIdUC.call(req.params?.id as string);
  }

  async listDeviceByOrgId(req: IRequest): Promise<IPaginated<Device>> {
    const request: ListClusterByOrgIdRequest = {
      token: req.token,
      orgId: req.params?.id as string,
      page: req.body?.page as number,
      perPage: req.body?.perPage as number
    }
    return await this.listDeviceByOrgIdUC.call(request)
  }


  async listClusterByOrgId(req: IRequest): Promise<IPaginated<Cluster>> {
    const request: ListClusterByOrgIdRequest = {
      token: req.token,
      orgId: req.params?.id as string,
      page: req.body?.page as number,
      perPage: req.body?.perPage as number
    }
    return await this.listClusterByOrgIdUC.call(request)
  }

  async getClusterById(req: IRequest): Promise<Cluster> {
    const request: GetClusterByIdRequest = {
      token: req.token,
      clusterId: req.params?.id as string
    }
    return await this.getClusterByIdUC.call(request)
  }
}
