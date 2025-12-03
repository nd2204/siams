import { useQuery } from '@tanstack/react-query'
import { orgServices } from "@/services/api/org-service";
import { QUERIES } from './query-keys';

export const useDeviceByOrg = (orgId?: string) => {
  return useQuery({
    queryKey: [QUERIES.ORG.LIST_DEVICES(orgId)],
    queryFn: async () => await orgServices.listDevices(orgId!),
    enabled: !!orgId
  });
}

