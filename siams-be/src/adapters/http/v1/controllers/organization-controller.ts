import { IPaginated, IRequest } from '@shared/interfaces'
import { Cluster, Organization } from '@domain/entities'
import { CreateOrganizationUC, GetOrganizationByIdUC } from '@feature/organization'
import { CreateOrganizationResponse } from '@feature/organization/dtos';
import {
  CreateClusterUC,
  GetClusterByIdUC,
  ListClusterByOrgIdUC,
} from '@feature/cluster';
import { CreateClusterResponse } from '@feature/cluster/dtos/create-cluster-response';

export class OrganizationController {

  constructor(
    private createOrgUC: CreateOrganizationUC,
    private getOrgByIdUC: GetOrganizationByIdUC,
    private createClusterUC: CreateClusterUC,
    private getClusterByIdUC: GetClusterByIdUC,
    private listClusterByOrgIdUC: ListClusterByOrgIdUC
  ) { }

  async create(req: IRequest): Promise<CreateOrganizationResponse> {
    const org = await this.createOrgUC.call({
      name: req.body?.name,
      userId: req.body?.userId
    });
    return org
  }

  async getById(req: IRequest): Promise<Organization> {
    const org = await this.getOrgByIdUC.call(req.params?.id as string);
    return org
  }

  async createCluster(req: IRequest): Promise<CreateClusterResponse> {
    const cluster = await this.createClusterUC.call({
      token: req.token,
      orgId: req.params?.id as string,
      name: req.body?.name,
      location: req.body?.location
    })
    return cluster
  }

  async listClusterByOrgId(req: IRequest): Promise<IPaginated<Cluster>> {
    const cluster = await this.listClusterByOrgIdUC.call({
      token: req.token,
      orgId: req.params?.id as string,
      page: req.body?.page as number,
      perPage: req.body?.perPage as number
    })
    return cluster
  }

  async getClusterById(req: IRequest): Promise<Cluster> {
    const cluster = await this.getClusterByIdUC.call(
      req.params?.id as string
    )
    return cluster
  }
}
