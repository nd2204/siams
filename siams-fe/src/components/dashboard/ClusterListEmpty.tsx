import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { IconCpu, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

export default function ClusterListEmpty({
  orgId,
  onRefresh
}: {
  orgId: string,
  onRefresh?: () => void
}) {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyDescription>
          Empty Cluster
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <Button variant="outline" className="mt-4" disabled={refreshing} onClick={() => {
          onRefresh && onRefresh();
          new Promise(() => {
            setRefreshing(true)
            setTimeout(() => {
              setRefreshing(false)
            }, 1000)
          })
        }}>
          {refreshing ? <><Spinner />Refreshing ...</> : <><IconRefresh />Refresh</>}
        </Button>
      </EmptyContent>

      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
      </Button>
    </Empty>
  )
}

