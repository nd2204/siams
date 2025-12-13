import { OrganizationId } from "@domain/entities/organization";
import { OrgUserDTO } from "@domain/repositories/organization-user-repo";
import { IPaginated } from "@shared/interfaces";
import { IPaginatedRequest } from "@shared/interfaces/paginated-request";

export interface ListOrgUserRequest extends IPaginatedRequest {
  token: string,
  org_id: OrganizationId
}

export type ListOrgUserResponse = IPaginated<OrgUserDTO>
