import { Card } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { CpuIcon, MemoryStick, Wifi, Zap } from "lucide-react";
import { IconCpu, IconEyeFilled, IconHistory, IconInfoCircle, IconProgressAlert, IconProgressCheck } from "@tabler/icons-react";
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
import { RoutesBreadcrumb } from "@/components/RoutesBreadCrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import React from "react";
import type { Device } from "@/types/device/index";
import { DeviceEventTimeline } from "@/components/device/DeviceEventTimeline";

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
          <div className="flex flex-1 flex-row justify-between content-center align-middle">
            <div className="flex flex-1 justify-center flex-col">
              <RoutesBreadcrumb />
            </div>
            <div className="flex flex-1 justify-end gap-3 items-center">
              <OnChainBadge />
              <ProvisionBadge prov_status={device.prov_status} />
              <Separator orientation="vertical" />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon-lg">
                    <IconHistory />
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:min-w-xl md:min-w-xl w-50%" side={"left"}>
                  <SheetHeader>
                    <div>
                      <SheetTitle>Activity</SheetTitle>
                      <SheetDescription>
                        Device event history with blockchain verification.
                      </SheetDescription>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <IconInfoCircle className="h-3 w-3" />
                      Latest first
                    </Badge>
                  </SheetHeader>
                  <Separator />
                  <DeviceEventTimeline deviceId={device.id} className="px-4" />
                </SheetContent>
              </Sheet>
            </div>
          </div>
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
                {device.status == 'online' && deviceStatus &&
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
                    {device.status === "online" && deviceStatus && deviceStatus.wifi &&
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
                    <IconEyeFilled className="w-3.5 h-3.5" />
                    <span className='font-semibold'>{formatLastSeenTime(new Date(device.last_seen_at))}</span>
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

const OnChainBadge = React.memo(function OnChainBadge({ on_chain }: { on_chain?: Device["prov_onchain"] }) {
  let Icon = null;
  let style = "";
  let text = ""

  if (!!on_chain) {
    Icon = IconProgressCheck
    style = "py-1.5 bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/30"
    text = "On-chain"
  } else {
    Icon = IconProgressAlert
    style = "py-1.5 bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/30"
    text = "Unverified"
  }

  return (
    <Badge variant={"secondary"} className={cn("rounded-full px-3 py-1.5", style)} >
      <div className="flex align-middle items-center justify-center gap-1">
        <Icon strokeWidth={2} size={16} />
        <span className="font-semibold">{text}</span>
      </div>
    </Badge>
  )
})

const ProvisionBadge = React.memo(function ProvisionBadge({ prov_status }: { prov_status?: Device["prov_status"] }) {
  let Icon = null
  let style = ""
  let text = ""

  if (prov_status && prov_status === "PROVISIONED") {
    Icon = IconProgressCheck
    style = "bg-accent-green/10 text-accent-green border border-accent-green/30"
    text = "Provisioned"
  } else {
    Icon = IconProgressAlert
    style = "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/30"
    text = "Not Provisioned"
  }

  return (
    <Badge variant={"secondary"} className={cn("rounded-full px-3 py-1.5", style)} >
      <div className="flex align-middle items-center justify-center gap-1">
        <Icon strokeWidth={2} size={16} />
        <span className="font-semibold">{text}</span>
      </div>
    </Badge>
  )
})

