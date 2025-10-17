import { IRequest } from '@shared/interfaces'
import { Organization } from '@domain/entities'
import { CreateOrganizationUC, GetOrganizationByIdUC } from '@feature/organization'
import { CreateOrganizationResponse } from '@feature/organization/dtos';

export default class OrganizationController {

  constructor(
    private createOrgUC: CreateOrganizationUC,
    private getByIdUC: GetOrganizationByIdUC,
  ) { }

  async create(req: IRequest): Promise<CreateOrganizationResponse> {
    const org = await this.createOrgUC.call({
      name: req.body?.name,
      userId: req.body?.userId
    });
    return org
  }

  async getById(req: IRequest): Promise<Organization> {
    const org = await this.getByIdUC.call(req.params?.id as string);
    return org
  }

}
