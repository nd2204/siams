import { useQuery } from "@tanstack/react-query"
import { clusterServices } from "@/services/api/cluster-service";
import { QUERIES } from "./query-keys";

export const useClusterDetail = (id?: string) => {
  return useQuery({
    queryKey: [QUERIES.CLUSTER.BY_ID(id!)],
    queryFn: async () => await clusterServices.getById(id!),
  });
}
