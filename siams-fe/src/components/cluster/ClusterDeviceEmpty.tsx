import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { IconCpu, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

export default function ClusterDeviceEmpty({
  clusterId,
  orgId,
  onRefresh
}: {
  clusterId: string,
  orgId: string,
  onRefresh?: () => void
}) {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCpu />
        </EmptyMedia>
        <EmptyTitle>No Device Connected</EmptyTitle>
        <EmptyDescription>
          Connect your device to the cluster using the following identifiers.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <div className="">
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-xs font-semibold font-mono">Cluster ID</span>
            <Badge variant="outline" className="text-muted-foreground font-mono font-semibold p-1.5">
              {clusterId}
            </Badge>
            <span className="text-muted-foreground text-xs font-semibold font-mono pt-2">Organization ID</span>
            <Badge variant="outline" className="text-muted-foreground font-mono font-semibold p-1.5">
              {orgId}
            </Badge>
          </div>
        </div>
        <div className="flex flex-row items-center gap-3 mt-4">
          <Button variant="outline" disabled={refreshing} onClick={() => {
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
          <span className="text-muted-foreground">or</span>
          <Button variant="default" disabled={refreshing} onClick={() => {
            onRefresh && onRefresh();
          }}>
            Assign device
          </Button>
        </div>
      </EmptyContent>

      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon className="ml-1 h-4 w-4" />
        </a>
      </Button>
    </Empty>
  )
}

