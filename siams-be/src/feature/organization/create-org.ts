import { IOrganizationRepository, IOrganizationUserRepository, IRoleRepository, IUserRepository } from "@domain/repositories";
import { Organization } from "@/domain/entities";
import { CreateOrganizationRequest, CreateOrganizationResponse } from "./dtos";
import { ValidationError } from "@shared/errors";
import { IUseCase, IValidator } from "@shared/interfaces";
import { UserNotFoundError } from "@domain/errors";
import { v4 as uuidv4 } from "uuid"

export class CreateOrganizationUC implements IUseCase<CreateOrganizationResponse> {
  constructor(
    private readonly repo: IOrganizationRepository,
    private readonly orgUserRepo: IOrganizationUserRepository,
    private readonly userRepo: IUserRepository,
    private readonly roleRepo: IRoleRepository,
    private readonly validator: IValidator<CreateOrganizationRequest>
  ) { }

  async call(req: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    const { value: r, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    // slug must be unique
    const slug = r.slug!.trim();
    const existingSlug = await this.repo.findOneBy({ slug });
    if (existingSlug) {
      throw new ValidationError("Organization with this slug already exists");
    }

    // user must exists
    const existingUser = await this.userRepo.findOneBy({ id: r.userId! })
    if (!existingUser) {
      throw new UserNotFoundError(r.userId!)
    }

    const name = r.name!.trim();
    const default_role = "ORG_OWNER"
    const org = new Organization({
      id: uuidv4(),
      name,
      slug,
      createdAt: new Date()
    });

    const savedOrg = await this.repo.create(org)
    await this.orgUserRepo.addUserToOrg(org.id, existingUser.id, { name: default_role });
    const map = await this.roleRepo.getRoleNamePermissionMap();

    return {
      id: savedOrg.id,
      name: savedOrg.name,
      slug: savedOrg.slug,
      role: default_role,
      permissions: map[default_role],
      createdAt: savedOrg.createdAt!
    };
  }
}
