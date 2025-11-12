import {
  IconCpu,
  IconDeviceHeartMonitorFilled,
  IconShredder,
  IconTrendingDown,
  IconTrendingUp
} from "@tabler/icons-react"
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from '@/lib/utils';
import { Separator } from "../ui/separator";
import type { Cluster } from "@/types/device";
import { useDeviceByCluster } from "@/hooks/queries/use-device-by-cluster";

export default function ClusterDetailInfoSection({ cluster }: { cluster: Cluster }) {
  const { data: devices } = useDeviceByCluster(cluster.id);

  const total = devices ? devices.pagination.total : 0;

  return (
    <div className={cn(
      "@xl/main:grid-cols-2 @5xl/main:grid-cols-3",
      "grid grid-cols-1 gap-4",
    )}>
      <Card className="@container/card gap-0 pt-0 pb-3">
        <CardHeader className="flex items-center justify-between px-3">
          <CardTitle className="text-foreground py-3">
            <div className="flex items-center gap-2">
              <IconCpu size={20} />
              <span>Total Devices</span>
            </div>
          </CardTitle>
          <div className="flex h-full items-center">
            <Separator orientation="vertical" />
            <span className="text-secondary-foreground font-bold pl-4 pr-2">{total}</span>
          </div>
        </CardHeader>
        <Separator className="mb-3" />
        <CardFooter className="flex-col gap-1.5 items-start text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card gap-0 pt-0 pb-3">
        <CardHeader className="flex items-center justify-between px-3">
          <CardTitle className="text-foreground py-3">
            <div className="flex items-center gap-2">
              <IconShredder size={20} />
              <span>Total Sensors</span>
            </div>
          </CardTitle>
          <div className="flex h-full items-center">
            <Separator orientation="vertical" />
            <span className="text-muted-foreground font-bold pl-4 pr-2">N/a</span>
          </div>
        </CardHeader>
        <Separator className="mb-3" />
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card gap-0 pt-0 pb-3">
        <CardHeader className="flex items-center justify-between px-3">
          <CardTitle className="text-foreground py-3">
            <div className="flex items-center gap-2">
              <IconDeviceHeartMonitorFilled size={20} />
              <span>Cluster Health</span>
            </div>
          </CardTitle>
          <div className="flex h-full items-center">
            <Separator orientation="vertical" />
            <span className="text-secondary-foreground font-bold pl-4 pr-2">100%</span>
          </div>
        </CardHeader>
        <Separator className="mb-3" />
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
    </div>
  )
}
