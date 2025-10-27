import { IPaginatedRequest } from "@shared/interfaces/paginated-request";

export interface ListClusterByOrgIdRequest extends IPaginatedRequest {
  token?: string,
  orgId?: string,
}
