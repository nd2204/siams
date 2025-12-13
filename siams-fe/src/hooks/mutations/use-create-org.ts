import { orgServices } from "@/services/api/org-service"
import type { CreateOrganizationRequest } from "@/types/organization"
import { useMutation } from "@tanstack/react-query"

export const useCreateOrganization = () => {
  return useMutation({
    mutationFn: (req: CreateOrganizationRequest) => {
      return orgServices.create(req)
    }
  })
}
