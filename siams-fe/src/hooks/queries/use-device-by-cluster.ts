import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "./query-keys"
import { clusterServices } from "@/services/api/cluster-service"

export const useDeviceByCluster = (clusterId: string) => {
  return useQuery({
    queryKey: [QUERIES.CLUSTER.LIST_DEVICES(clusterId)],
    queryFn: async () => await clusterServices.listDevices(clusterId)
  })
}
