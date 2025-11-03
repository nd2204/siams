import { IPaginatedRequest } from "@shared/interfaces/paginated-request"

export interface ListDeviceByClusterIdRequest extends IPaginatedRequest {
  token?: string,
  orgId?: string,
  clusterId?: string
}
