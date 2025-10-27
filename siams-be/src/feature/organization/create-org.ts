import { IOrganizationRepository, IOrganizationUserRepository, IRoleRepository, IUserRepository } from "@domain/repositories";
import { Organization, OrganizationUser } from "@/domain/entities";
import { CreateOrganizationRequest, CreateOrganizationResponse } from "./dtos";
import { NotFoundError, ValidationError } from "@shared/errors";
import { IUseCase, IValidator } from "@shared/interfaces";
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
    const { value, errors } = this.validator.validate(req)
    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    // slug must be unique
    const slug = value.slug!.trim();
    const existingSlug = await this.repo.findOneBy({ slug });
    if (existingSlug) {
      throw new ValidationError("Organization with this slug already exists");
    }

    // user must exists
    const existingUser = await this.userRepo.findOneBy({ id: value.userId! })
    if (!existingUser) {
      throw new NotFoundError(`User with id=${value.userId} not found.`)
    }

    const name = value.name!.trim();
    const org = new Organization({
      id: uuidv4(),
      name,
      slug,
      createdAt: new Date()
    });

    const savedOrg = await this.repo.create(org)

    const role = await this.roleRepo.findOneBy({ name: "ORG_OWNER" })
    if (!role) {
      throw new Error("Role does not exist")
    }

    const orgUser: OrganizationUser = {
      id: uuidv4(),
      orgId: org.id,
      userId: existingUser.id,
      roleId: role!.id,
    }
    await this.orgUserRepo.create(orgUser)

    return {
      id: savedOrg.id,
      name: savedOrg.name,
      slug: savedOrg.slug,
      createAt: savedOrg.createdAt!
    };
  }
}
