import { Organization, User } from "@domain/entities";
import { UnauthorizedError } from "@shared/errors";
import { IError } from "@shared/interfaces";

export class OrganizationUserNotFoundError extends UnauthorizedError implements IError {
  details?: unknown;

  constructor(org_id: Organization["id"], user_id: User["id"], details?: any) {
    super(`User with id=${user_id} does not belong to this organization (${org_id})`);
    this.details = details;
  }
}
