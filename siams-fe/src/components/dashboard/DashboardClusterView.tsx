import ClusterListEmpty from "@/components/dashboard/ClusterListEmpty";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClusterByOrg } from "@/hooks/queries/use-cluster-by-org"
import { useAuth } from "@/hooks/use-auth";
import { DataTable } from "../ui/data-table";
import { clusterColumns } from "../cluster/ClusterColumn";

export default function DashboardClusterView({
}) {
  const { activeOrg } = useAuth()
  const { data: cluster, status: clusterQueryStatus } = useClusterByOrg(activeOrg?.id);

  if (clusterQueryStatus === 'pending') {
    return (
      <Skeleton className="flex flex-1" />
    )
  }

  if (clusterQueryStatus === 'error' || !cluster) {
    return (
      <Card className="@container/card flex flex-1 bg-background overflow-hidden pt-2 pb-0 gap-0 border-dashed border-2">
      </Card>
    )
  }

  if (cluster.pagination.total === 0) {
    return (
      <Card className="@container/card flex flex-1 bg-background overflow-hidden pt-2 pb-0 gap-0 border-dashed border-2">
        <ClusterListEmpty orgId={activeOrg?.id!} />
      </Card>
    )
  }

  return (
    <>
      <DataTable data={cluster.data} columns={clusterColumns} />
    </>
  )
}

