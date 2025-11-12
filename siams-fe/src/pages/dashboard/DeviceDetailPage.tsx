import { Card } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Zap } from "lucide-react";
import { IconCpu } from "@tabler/icons-react";
import { useDeviceDetail } from "@/hooks/queries/use-device-detail";
import { cn } from "@/lib/utils";
import { useParams } from "react-router"

import DeviceNotFound from "@/components/device/DeviceNotFound";
import DeviceDetailInfoSection from "@/components/device/DeviceDetailInfoSection";
import { DeviceCommandsPanel } from "@/components/device/DeviceCommandPanel";
import { Badge } from "@/components/ui/badge";
import DeviceTelemetrySection from "@/components/device/DeviceTelemetrySection";

export default function DeviceDetailPage() {
  const { id } = useParams();
  const { data: device, status: deviceQueryStatus } = useDeviceDetail(id)

  if (deviceQueryStatus == "error" || !device) {
    return (
      <div className="flex flex-1 flex-col">
        <DeviceNotFound />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-1 flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 lg:px-6 ">
          <Card className={cn("flex", "border-accent-blue/35 from-accent-blue/10 to-card bg-card bg-gradient-to-t shadow-xs px-4 lg:px-6")}>
            <Item variant="default" className="p-0 bg-none">
              <ItemMedia variant="icon" className="border-accent-blue/20 bg-accent-blue/15 self-center">
                <IconCpu />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className='text-lg font-semibold gap-4'>
                  <span>{device.name}</span>
                </ItemTitle>
                <ItemDescription className="flex gap-1 items-center">
                  {device.model}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant="outline" className={cn("rounded-full",
                  device.status !== "online" && "text-muted-foreground"
                )}>
                  {device.status === "online" ? (
                    <div className="relative flex h-2 w-2 items-center justify-center">
                      <div className="absolute h-2 w-2 rounded-full bg-green-600 opacity-75 animate-ping"></div>
                      <div className="relative h-2 w-2 rounded-full bg-green-600"></div>
                    </div>
                  ) : (
                    <div className="relative flex h-2 w-2 items-center justify-center">
                      <div className="relative h-2 w-2 rounded-full bg-secondary"></div>
                    </div>
                  )}
                  {device.status}
                </Badge>
              </ItemActions>
            </Item>
            <DeviceDetailInfoSection device={device} />
          </Card>

          <DeviceTelemetrySection device={device} />

          {/* Command panel section */}
          <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-muted-foreground font-semibold">Control &amp; Commands</h3>
            </div>
            <DeviceCommandsPanel device={device} />
          </div>
        </div>
      </div>
    </div>
  )
}

