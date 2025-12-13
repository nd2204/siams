import { OrganizationInvite, OrganizationInviteId } from "@domain/entities/organization-invite";
import { IRepository } from "@shared/interfaces";

export interface IOrganizationInviteRepository extends IRepository<OrganizationInvite> {
  markAccepted(id: OrganizationInviteId): Promise<void>;
}
