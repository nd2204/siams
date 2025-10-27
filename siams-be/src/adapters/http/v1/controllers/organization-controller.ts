import { IPaginated, IRequest } from '@shared/interfaces'
import { Cluster, Organization } from '@domain/entities'
import { CreateOrganizationRequest, CreateOrganizationResponse } from '@feature/organization/dtos';
import { CreateClusterResponse } from '@feature/cluster/dtos/create-cluster-response';
import { CreateOrganizationUC } from '@feature/organization/create-org';
import { GetOrganizationByIdUC } from '@feature/organization/get-org-by-id';
import { CreateClusterUC } from '@feature/cluster/create-cluster';
import { GetClusterByIdUC } from '@feature/cluster/get-by-id';
import { ListClusterByOrgIdUC } from '@feature/cluster/list-clusters-by-org-id';
import { GetClusterByIdRequest } from '@feature/cluster/dtos/get-cluster-by-id-request';
import { ListClusterByOrgIdRequest } from '@feature/cluster/dtos/list-cluster-by-org-id-request';
import { CreateClusterRequest } from '@feature/cluster/dtos/create-cluster-request';

export class OrganizationController {

  constructor(
    private createOrgUC: CreateOrganizationUC,
    private getOrgByIdUC: GetOrganizationByIdUC,
    private createClusterUC: CreateClusterUC,
    private getClusterByIdUC: GetClusterByIdUC,
    private listClusterByOrgIdUC: ListClusterByOrgIdUC
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

  async createCluster(req: IRequest): Promise<CreateClusterResponse> {
    const request: CreateClusterRequest = {
      token: req.token,
      orgId: req.params?.id as string,
      name: req.body?.name,
      location: req.body?.location
    }
    return await this.createClusterUC.call(request)
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
