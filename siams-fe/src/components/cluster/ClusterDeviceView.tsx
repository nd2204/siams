import type { Cluster } from "@/types/device";
import { Card, CardContent } from "../ui/card";
import ClusterDeviceEmpty from "./ClusterDeviceEmpty";
import { useAuth } from "@/hooks/use-auth"
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/hooks/queries/query-keys";

export default function ClusterDeviceView({ cluster }: { cluster: Cluster }) {
  const { activeOrg } = useAuth()
  const queryClient = useQueryClient();

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [QUERIES.CLUSTER.LIST_DEVICES(cluster.id)]
    })
  }, [])

  return (
    <>
      {(cluster.devices && cluster.devices.pagination.total > 0) ? (
        <div className="flex flex-1">
          <Card className="@container/card flex-1 overflow-hidden pt-2 pb-0 gap-0">
            <CardContent className="px-2">
            </CardContent>
          </Card>
          <Card className="@container/card flex flex-1 overflow-hidden p-0 m-2">
          </Card>
        </div>
      ) : (
        <Card className="@container/card flex flex-1 bg-background overflow-hidden pt-2 pb-0 gap-0 border-dashed">
          <ClusterDeviceEmpty clusterId={cluster.id} orgId={activeOrg!.id} onRefresh={onRefresh} />
        </Card>
      )}
    </>
  )
}

