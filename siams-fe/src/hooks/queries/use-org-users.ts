import { ENDPOINTS } from "@/services/api/endpoints"
import { orgServices } from "@/services/api/org-service"
import { useQuery } from "@tanstack/react-query"

export const useOrgUsers = (orgId?: string, page?: number, perPage?: number) => {
  return useQuery({
    queryKey: [ENDPOINTS.ORG.USERS(orgId!)],
    queryFn: async () => await orgServices.listOrgUsers(orgId!, page, perPage),
    enabled: !!orgId
  })
}
