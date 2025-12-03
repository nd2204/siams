import { Card } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Clock, CpuIcon, MemoryStick, Wifi, Zap } from "lucide-react";
import { IconCpu } from "@tabler/icons-react";
import { useDeviceDetail } from "@/hooks/queries/use-device-detail";
import { cn } from "@/lib/utils";
import { useParams } from "react-router"

import DeviceNotFound from "@/components/device/DeviceNotFound";
import DeviceDetailInfoSection from "@/components/device/DeviceDetailInfoSection";
import { DeviceCommandsPanel } from "@/components/device/DeviceCommandPanel";
import { Badge } from "@/components/ui/badge";
import DeviceTelemetrySection from "@/components/device/DeviceTelemetrySection";
import { DeviceSocketStatusBridge } from "@/components/device/DeviceSocketStatusBridge";
import { useDeviceStatus } from "@/hooks/queries/use-device-status";
import { formatLastSeenTime } from "@/utils/time-utils";
import { Separator } from "@/components/ui/separator";
import { RadialChart } from "@/components/RadialChart";

export default function DeviceDetailPage() {
  const { id } = useParams();
  const { data: device, status: deviceQueryStatus } = useDeviceDetail(id)
  const { data: deviceStatus } = useDeviceStatus(id);

  if (deviceQueryStatus == "error" || !device) {
    return (
      <div className="flex flex-1 flex-col">
        <DeviceNotFound />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <DeviceSocketStatusBridge device_id={device.id} />
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
                {deviceStatus &&
                  <>
                    <div className="flex items-center gap-4">
                      {deviceStatus.mem !== undefined &&
                        <div className="flex items-center gap-3">
                          <RadialChart
                            value={deviceStatus.mem}
                            label={`${(deviceStatus.mem * 100).toFixed(0)} %`}
                            color={""}
                            icon={MemoryStick} />
                        </div>
                      }
                      {deviceStatus.cpu !== undefined &&
                        <div className="flex items-center gap-3">
                          <RadialChart
                            value={deviceStatus.cpu}
                            label={`${(deviceStatus.cpu * 100).toFixed(0)} %`}
                            color={""}
                            icon={CpuIcon} />
                        </div>
                      }
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                  </>
                }


                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn(
                      "flex rounded-full gap-1.5 px-2 py-1",
                    )}>
                      {device.status == "online" ? (
                        <div className="relative flex h-2 w-2 items-center justify-center">
                          <div className="absolute h-2 w-2 rounded-full bg-green-600 opacity-75 animate-ping"></div>
                          <div className="relative h-2 w-2 rounded-full bg-green-600"></div>
                        </div>
                      ) : (
                        <div className="relative flex h-2 w-2 items-center justify-center">
                          <div className="relative h-2 w-2 rounded-full bg-secondary"></div>
                        </div>
                      )}
                      <span className="text-xs text-secondary-foreground font-mono font-bold">{device.status}</span>
                    </Badge>
                    {deviceStatus && deviceStatus.wifi &&
                      <Badge variant="outline" className="gap-1 px-2 py-1 rounded-full" title={`WiFi Signal: ${deviceStatus.wifi}dbm`}>
                        <Wifi className={cn(
                          `w-4 h-4`,
                          deviceStatus.wifi! >= -65 ? 'text-green-600'
                            : deviceStatus.wifi! >= -90 ? 'text-yellow-600'
                              : 'text-red-600'
                        )} />
                        <span className={
                          cn("text-xs font-mono",
                            device.status !== "online" && "text-muted-foreground"
                          )}>{deviceStatus.wifi!} dbm
                        </span>
                      </Badge>
                    }
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatLastSeenTime(new Date(device.last_seen_at))}</span>
                  </div>
                </div>
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
    </div >
  )
}

