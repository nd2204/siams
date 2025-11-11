import { IPaginatedRequest } from "@shared/interfaces/paginated-request";

export interface ListDeviceByOrgIdRequest extends IPaginatedRequest {
  token?: string,
  orgId?: string,
}
