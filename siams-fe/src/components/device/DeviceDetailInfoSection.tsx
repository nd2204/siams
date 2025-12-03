import {
  IconCode,
} from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from '@/lib/utils';
import { Separator } from "../ui/separator";
import type { Device } from "@/types/device/index";
import { useDeviceSensors } from "@/hooks/queries/use-device-sensor";
import { useDeviceActuators } from "@/hooks/queries/use-device-actuator";
import { useDeviceCommand } from "@/hooks/queries/use-device-command";
import { Skeleton } from "../ui/skeleton";
import { Power, Radio } from "lucide-react";

export default function DeviceDetailInfoSection({ device }: { device: Device }) {
  const { data: sensors, isPending: sensorsPending } = useDeviceSensors(device.id)
  const { data: actuators, isPending: actuatorsPending } = useDeviceActuators(device.id)
  const { data: commands, isPending: commandsPending } = useDeviceCommand(device.id)

  return (
    <div className={cn(
      "@xl/main:grid-cols-2 @5xl/main:grid-cols-3",
      "grid grid-cols-1 gap-4",
    )}>
      {!sensorsPending && sensors ?
        <>
          <Card className="@container/card gap-0 pt-0 pb-0">
            <CardHeader className="flex items-center justify-between px-3">
              <CardTitle className="text-foreground py-3">
                <div className="flex items-center gap-2">
                  <Radio size={18} />
                  <span>Total Sensors</span>
                </div>
              </CardTitle>
              <div className="flex h-full items-center">
                <Separator orientation="vertical" />
                <span className="font-bold pl-4 pr-2">{sensors!.length}</span>
              </div>
            </CardHeader>
          </Card>
        </>
        :
        <>
          <Skeleton className="@container/card gap-0 pt-0 pb-3">
          </Skeleton>
        </>
      }

      {!actuatorsPending && actuators ?
        <>
          <Card className="@container/card gap-0 pt-0 pb-0">
            <CardContent className="flex items-center justify-between px-3">
              <CardTitle className="text-foreground py-3">
                <div className="flex items-center gap-2">
                  <Power size={18} />
                  <span>Total Actuators</span>
                </div>
              </CardTitle>
              <div className="flex h-full items-center">
                <Separator orientation="vertical" />
                <span className="font-bold pl-4 pr-2">{actuators.length}</span>
              </div>
            </CardContent>
          </Card>
        </>
        :
        <>
          <Skeleton className="@container/card gap-0 pt-0 pb-3">
          </Skeleton>
        </>
      }

      {!commandsPending && commands ?
        <>
          <Card className="@container/card gap-0 pt-0 pb-0">
            <CardHeader className="flex items-center justify-between px-3">
              <CardTitle className="text-foreground py-3">
                <div className="flex items-center gap-2">
                  <IconCode size={18} />
                  <span>Total Commands</span>
                </div>
              </CardTitle>
              <div className="flex h-full items-center">
                <Separator orientation="vertical" />
                <span className="font-bold pl-4 pr-2">{commands.length}</span>
              </div>
            </CardHeader>
          </Card>
        </>
        :
        <>
          <Skeleton className="@container/card gap-0 pt-0 pb-3">
          </Skeleton>
        </>
      }
    </div>
  )
}
