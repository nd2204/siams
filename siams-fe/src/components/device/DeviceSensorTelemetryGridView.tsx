import type { Sensor } from "@/types/device/index";
import { Card, CardAction, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { SensorChart } from "./DeviceSensorChart";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { Separator } from "../ui/separator";
import { IconActivity, IconDroplet, IconGauge, IconSeedling, IconSun, IconTemperature, IconTestPipe, IconWind, type TablerIcon } from "@tabler/icons-react";

const SENSOR_ICONS: Record<string, TablerIcon> = {
  TEMPERATURE: IconTemperature,
  HUMIDITY: IconDroplet,
  MOISTURE: IconDroplet,
  PH: IconTestPipe,
  LIGHT_INTENSITY: IconSun,
  PRESSURE: IconGauge,
  NPK: IconSeedling,
  WIND_SPEED: IconWind,
};

const SENSOR_ICON_COLOR: Record<string, string> = {
  TEMPERATURE: "text-accent-yellow",
  HUMIDITY: "text-accent-blue",
  MOISTURE: "text-accent-blue",
  PH: "text-accent-purple",
  LIGHT_INTENSITY: "text-accent-yellow",
};

const GRID_MAP: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 lg:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4",
};

const getGridColumns = (n: number) =>
  GRID_MAP[n] ?? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

const SensorCard = memo(function SensorCard({ sensor }: { sensor: Sensor }) {
  const Icon = SENSOR_ICONS[sensor.type] ?? IconActivity;
  const iconColor = SENSOR_ICON_COLOR[sensor.type] ?? "text-foreground";

  return (
    <Card
      key={sensor.id}
      className={cn(
        "bg-card overflow-hidden relative hover:shadow-lg transition-all cursor-pointer"
      )}
    >
      {/* Header */}
      <CardHeader className="relative z-10 gap-0">
        <div className="flex items-start gap-4">
          <div className={cn("p-2 rounded-lg bg-secondary/50", iconColor)}>
            <Icon className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <div className="text-foreground text-sm font-semibold mb-0.5">
              {sensor.name}
            </div>
            <div className="text-muted-foreground text-xs font-mono">
              Local Id: {sensor.local_id}
            </div>
          </div>
        </div>
        <CardAction>
          <Badge variant="outline" className="capitalize text-xs ml-2">
            {sensor.type.replace("_", " ")}
          </Badge>
        </CardAction>
      </CardHeader>
      <Separator />

      {/* Mini Chart */}
      <CardContent className="relative z-10 p-0">
        <SensorChart sensor={sensor} />
      </CardContent>
    </Card>
  );
});

export default function DeviceSensorTelemtryGridView({ sensors }: { sensors: Sensor[] }) {
  return (
    <div className={cn(
      `grid gap-4 pt-4`,
      getGridColumns(sensors.length)
    )}>
      {sensors.map((sensor) => (
        <SensorCard key={sensor.id} sensor={sensor} />
      ))
      }
    </div >
  )
}
