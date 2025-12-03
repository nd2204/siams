import type { Sensor } from "@/types/device/index";
import { Card } from "../ui/card";
import {
  Activity,
  Droplets,
  Gauge,
  Sprout,
  Sun,
  TestTube,
  Thermometer,
  Wind
} from "lucide-react";
import { Badge } from "../ui/badge";
import { SensorChart } from "./DeviceSensorChart";
import { cn } from "@/lib/utils";
import { memo } from "react";

const SENSOR_ICONS: Record<string, any> = {
  TEMPERATURE: Thermometer,
  HUMIDITY: Droplets,
  MOISTURE: Droplets,
  PH: TestTube,
  LIGHT_INTENSITY: Sun,
  PRESSURE: Gauge,
  NPK: Sprout,
  WIND_SPEED: Wind,
};

const SENSOR_ICON_COLOR: Record<string, string> = {
  TEMPERATURE: "text-accent-red",
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
  const Icon = SENSOR_ICONS[sensor.type] ?? Activity;
  const iconColor = SENSOR_ICON_COLOR[sensor.type] ?? "text-slate-600";

  return (
    <Card
      key={sensor.id}
      className={cn(
        "p-4 bg-card overflow-hidden relative hover:shadow-lg transition-all cursor-pointer"
      )}
    >
      {/* Header */}
      <div className="relative z-10 mb-3">
        <div className="flex items-start gap-2 mb-2">
          <div className={cn("p-2 rounded-lg", iconColor)}>
            <Icon className="w-4 h-4" />
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
        <Badge variant="outline" className="capitalize text-xs">
          {sensor.type.replace("_", " ")}
        </Badge>
      </div>

      {/* Mini Chart */}
      <div className="relative z-10">
        <SensorChart sensor={sensor} />
      </div>
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
