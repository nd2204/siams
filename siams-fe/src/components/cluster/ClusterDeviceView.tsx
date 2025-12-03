import type { Cluster } from "@/types/cluster";
import { Card } from "../ui/card";
import ClusterDeviceEmpty from "./ClusterDeviceEmpty";
import { useAuth } from "@/hooks/use-auth"
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/hooks/queries/query-keys";
import { useDeviceByCluster } from "@/hooks/queries/use-device-by-cluster";
import { ClusterDeviceDataTable } from "./ClusterDeviceDataTable";
import { clusterDeviceColumns } from "./ClusterDeviceColumn";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

export default function ClusterDeviceView({ cluster }: { cluster: Cluster }) {
  const { activeOrg } = useAuth()
  const { data: devices, isPending } = useDeviceByCluster(cluster.id);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [QUERIES.CLUSTER.LIST_DEVICES(cluster.id)]
    })
  }, [])


  if (isPending) {
    return (
      <Skeleton />
    )
  }

  return (
    <>
      {(devices && devices.pagination.total > 0) ? (
        <div className="flex flex-1">
          <div className="@container/card flex-1 overflow-hidden pt-2 pb-0 gap-0">
            <div className="flex justify-between pb-4">
              <div className="font-semibold">Devices in this Cluster</div>
              <Badge variant="outline">
                {devices.pagination.total} devices
              </Badge>
            </div>
            <ClusterDeviceDataTable columns={clusterDeviceColumns} data={devices.data} />
          </div>
        </div>
      ) : (
        <Card className="@container/card flex flex-1 bg-background overflow-hidden pt-2 pb-0 gap-0 border-dashed">
          <ClusterDeviceEmpty clusterId={cluster.id} orgId={activeOrg!.id} onRefresh={onRefresh} />
        </Card>
      )}
    </>
  )
}

