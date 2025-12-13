import { apiClient } from "./client"
import type { ListUserByNameOrEmailRequest, ListUserByNameOrEmailResponse } from "@/types/user"
import { ENDPOINTS } from "./endpoints"

export const userServices = {
  async listByNameOrEmail(req: ListUserByNameOrEmailRequest): Promise<ListUserByNameOrEmailResponse> {
    return apiClient.post<ListUserByNameOrEmailResponse>(ENDPOINTS.USER.ROOT, req);
  }
}
