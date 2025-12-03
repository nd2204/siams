import { IOrganizationRepository } from "@domain/repositories";
import { Organization } from "@domain/entities";
import { IUseCase } from "@shared/interfaces";
import { ValidationError } from "@shared/errors";
import { OrganizationNotFoundError } from "@domain/errors";

export class GetOrganizationByIdUC implements IUseCase<Organization> {

  constructor(
    private readonly repo: IOrganizationRepository
  ) { }

  async call(id?: string): Promise<Organization> {
    if (!id) throw new ValidationError("Organization's id is required");
    const result = await this.repo.findOneBy({ id });
    if (!result) {
      throw new OrganizationNotFoundError(id)
    }
    return result;
  }

}
