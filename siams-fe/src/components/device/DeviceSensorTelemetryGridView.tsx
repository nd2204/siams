import type { Sensor } from "@/types/device";
import { Card } from "../ui/card";
import {
  Activity,
  Clock,
  Droplets,
  Gauge,
  Minus,
  Sprout,
  Sun,
  TestTube,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Wind
} from "lucide-react";
import { Badge } from "../ui/badge";
import { SensorChart } from "./DeviceSensorChart";
import { cn } from "@/lib/utils";

export default function DeviceSensorTelemtryGridView({ sensors }: { sensors: Sensor[] }) {
  const getSensorIcon = (type: string) => {
    const icons: Record<string, any> = {
      TEMPERATURE: Thermometer,
      HUMIDITY: Droplets,
      MOISTURE: Droplets,
      PH: TestTube,
      LIGHT_INTENSITY: Sun,
      PRESSURE: Gauge,
      NPK: Sprout,
      WIND_SPEED: Wind,
    };
    const Icon = icons[type] || Activity;
    return Icon;
  };

  const getSensorColor = (type: string) => {
    const colors: Record<string, string> = {
      TEMPERATURE: 'from-red-500 to-orange-500',
      HUMIDITY: 'from-blue-500 to-cyan-500',
      MOISTURE: 'from-blue-600 to-teal-500',
      PH: 'from-purple-500 to-pink-500',
      LIGHT_INTENSITY: 'from-yellow-500 to-amber-500',
      PRESSURE: 'from-indigo-500 to-blue-500',
      NPK: 'from-green-500 to-emerald-500',
      WIND_SPEED: 'from-cyan-500 to-sky-500',
    };
    return colors[type] || 'from-slate-500 to-slate-600';
  };

  const getSensorBgColor = (type: string) => {
    const colors: Record<string, string> = {
      TEMPERATURE: 'bg-red-50 border-red-200',
      HUMIDITY: 'bg-blue-50 border-blue-200',
      MOISTURE: 'bg-teal-50 border-teal-200',
      PH: 'bg-purple-50 border-purple-200',
      LIGHT_INTENSITY: 'bg-yellow-50 border-yellow-200',
      PRESSURE: 'bg-indigo-50 border-indigo-200',
      NPK: 'bg-green-50 border-green-200',
      WIND_SPEED: 'bg-cyan-50 border-cyan-200',
    };
    return colors[type] || 'bg-slate-50 border-slate-200';
  };

  const getSensorIconColor = (type: string) => {
    const colors: Record<string, string> = {
      TEMPERATURE: 'text-red-600',
      HUMIDITY: 'text-blue-600',
      MOISTURE: 'text-teal-600',
      PH: 'text-purple-600',
      LIGHT_INTENSITY: 'text-yellow-600',
      PRESSURE: 'text-indigo-600',
      NPK: 'text-green-600',
      WIND_SPEED: 'text-cyan-600',
    };
    return colors[type] || 'text-slate-600';
  };

  const getChartConfig = (type: string) => {
    const chartConfig: Record<string, { type: 'line' | 'area' | 'bar'; color: string }> = {
      TEMPERATURE: { type: 'line', color: '#ef4444' },
      HUMIDITY: { type: 'area', color: '#3b82f6' },
      MOISTURE: { type: 'area', color: '#14b8a6' },
      PH: { type: 'line', color: '#8b5cf6' },
      LIGHT_INTENSITY: { type: 'line', color: '#eab308' },
      PRESSURE: { type: 'bar', color: '#6366f1' },
      NPK: { type: 'bar', color: '#22c55e' },
      WIND_SPEED: { type: 'line', color: '#06b6d4' },
    };
    return chartConfig[type] || { type: 'line', color: '#64748b' };
  };

  const getTrendIcon = (sensor: Sensor) => {
    // Mock trend calculation - in real app, compare with previous value
    const random = Math.random();
    if (random > 0.6) return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (random < 0.4) return <TrendingDown className="w-3 h-3 text-red-600" />;
    return <Minus className="w-3 h-3 text-slate-400" />;
  };

  const getGridColumns = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 lg:grid-cols-2';
    if (count === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    if (count === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <div className={`grid ${getGridColumns(sensors.length)} gap-4 pt-4`}>
      {
        sensors.map(sensor => {
          const Icon = getSensorIcon(sensor.type);
          const config = getChartConfig(sensor.type);

          return (
            <Card
              key={sensor.id}
              className={cn(
                `p-4 border-2`,
                `bg-background`,
                `overflow-hidden relative hover:shadow-lg transition-all cursor-pointer`,
              )}
            >

              {/* Sensor Header */}
              <div className="relative z-10 mb-3">
                <div className="flex items-start gap-2 mb-2">
                  <div className={`p-2 rounded-lg bg-secondary shadow-sm ${getSensorIconColor(sensor.type)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-foreground text-sm mb-0.5">{sensor.name}</div>
                    <div className="text-muted-foreground text-xs font-mono">Local Id: {sensor.localId}</div>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize text-xs">
                  {sensor.type.replace('_', ' ')}
                </Badge>
              </div>

              {/* Current Reading with Trend */}
              {/* <div className="mb-3 p-3 bg-background rounded-lg border shadow-sm relative z-10"> */}
              {/*   <div className="text-secondary text-xs mb-1.5">Current Reading</div> */}
              {/*   <div className="flex items-center justify-between"> */}
              {/*     <div className="flex items-baseline gap-1.5"> */}
              {/*       <span className={`text-2xl ${getSensorIconColor(sensor.type)}`}> */}
              {/*         {sensor.currentValue} */}
              {/*       </span> */}
              {/*       <span className="text-foreground text-sm">{sensor.unit}</span> */}
              {/*     </div> */}
              {/*     <div className="flex items-center gap-1"> */}
              {/*       {getTrendIcon(sensor)} */}
              {/*     </div> */}
              {/*   </div> */}
              {/*   <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1.5"> */}
              {/*     <Clock className="w-3 h-3" /> */}
              {/*     <span>{sensor.lastUpdate}</span> */}
              {/*   </div> */}
              {/* </div> */}

              {/* Mini Chart */}
              <div className="relative z-10">
                <SensorChart
                  title=""
                  sensor={sensor}
                  type={"area"}
                  color={config.color}
                />
              </div>
            </Card>
          );
        })
      }
    </div >
  )
}
