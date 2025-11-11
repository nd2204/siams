import { Device } from "@domain/entities";
import { IDeviceRepository, IOrganizationUserRepository } from "@domain/repositories";
import { IPaginated, IUseCase, IValidator } from "@shared/interfaces";
import { UnauthorizedError, ValidationError } from "@shared/errors";
import { AuthResponse } from "@feature/user/dtos/auth-response";
import { ListDeviceByOrgIdRequest } from "./dtos/list-by-org-id-request";

export class ListDeviceByOrgIdUC implements IUseCase<IPaginated<Device>> {
  constructor(
    private orgUserRepo: IOrganizationUserRepository,
    private deviceRepo: IDeviceRepository,
    private validator: IValidator<ListDeviceByOrgIdRequest>,
    private verifyToken: (token: string) => AuthResponse["user"]
  ) { }

  async call(req: ListDeviceByOrgIdRequest): Promise<IPaginated<Device>> {
    const { value, errors } = this.validator.validate(req);

    const auth = this.verifyToken(value.token!)
    const foundUserByOrg = await this.orgUserRepo.findOneBy({
      userId: auth.id,
      orgId: value.orgId
    })

    if (!foundUserByOrg) {
      throw new UnauthorizedError()
    }

    if (errors && errors.length > 0) {
      throw new ValidationError("Invalid request", errors);
    }

    return await this.deviceRepo.listByOrg(
      value.orgId!,
      value.page ?? 1,
      value.perPage ?? 10
    )
  }
}
