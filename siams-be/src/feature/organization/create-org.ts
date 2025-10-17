import { IOrganizationRepository, IUserRepository } from "@domain/repositories";
import { Organization } from "@/domain/entities";
import { CreateOrganizationRequest, CreateOrganizationResponse } from "./dtos";
import { NotFoundError, ValidationError } from "@shared/errors";
import { IUseCase, IValidator } from "@shared/interfaces";
import { v4 as uuidv4 } from "uuid"

export class CreateOrganizationUC implements IUseCase<CreateOrganizationResponse> {
  constructor(
    private readonly repo: IOrganizationRepository,
    private readonly userRepo: IUserRepository,
    private readonly validator: IValidator<CreateOrganizationRequest>
  ) { }

  async call(req: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    const { value, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    // name must be unique
    const name = value.name!.trim();
    const existing = await this.repo.findOneBy({ name });
    if (existing) {
      throw new ValidationError("Organization with this name already exists");
    }

    // user must exists
    const existingUser = await this.userRepo.findOneBy({ id: value.userId! })
    if (!existingUser) {
      throw new NotFoundError(`User with id=${value.userId} not found.`)
    }

    const org = new Organization({
      id: uuidv4(),
      name: name,
      created_at: new Date()
    });

    const savedOrg = await this.repo.create(org)
    await this.userRepo.update(existingUser.id, { orgId: org.id })

    return new CreateOrganizationResponse(
      savedOrg.id,
      savedOrg.name,
      savedOrg.created_at
    );
  }
}
