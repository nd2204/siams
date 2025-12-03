import { Organization } from "@domain/entities";
import { NotFoundError } from "@shared/errors";
import { IError } from "@shared/interfaces";

export class OrganizationNotFoundError extends NotFoundError implements IError {
  details?: unknown;

  constructor(org_id: Organization["id"], details?: any) {
    super(`Org with id=${org_id} not found`);
    this.details = details;
  }
}
