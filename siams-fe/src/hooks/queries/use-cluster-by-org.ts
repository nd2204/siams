import { useQuery } from '@tanstack/react-query'
import { orgServices } from "@/services/api/org-service";
import { QUERIES } from './query-keys';

export const useClusterByOrg = (orgId: string) => {
  return useQuery({
    queryKey: [QUERIES.ORG.LIST_CLUSTERS(orgId)],
    queryFn: async () => await orgServices.listCluster(orgId),
  });
}

