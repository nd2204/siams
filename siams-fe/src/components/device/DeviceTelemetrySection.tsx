import { useDeviceSensors } from "@/hooks/queries/use-device-sensor";
import { useState } from "react";
import type { Device, Sensor } from "@/types/device";
import { BarChart3, Grid3x3, List, Pause, Play, Radio } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import DeviceSensorTelemtryGridView from "./DeviceSensorTelemetryGridView";

type ViewMode = 'grid' | 'list' | 'compact';
type TimeRange = '1h' | '6h' | '24h' | '7d';


export default function DeviceTelemetrySection({ device }: { device: Device }) {
  const { data: sensors, status: sensorsStatus } = useDeviceSensors(device.id)
  const [isLive, setIsLive] = useState<boolean>(false)
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const TitleSection = () => {
    return (
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-muted-foreground font-semibold">Live Sensor Telemetry</h3>
            <Badge variant="outline">
              {sensors!.length} available
            </Badge>
            {device.status === 'online' && isLive && (
              <Badge className="bg-green-100 text-accent-green-700 border-green-200">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse mr-1.5" />
                Streaming
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">Real-time monitoring and visualization</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Range Selector */}
          <div className="flex items-center bg-background border rounded-lg p-1">
            {(['1h', '6h', '24h', '7d'] as TimeRange[]).map(range => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>

          {/* Live Toggle */}
          <Button
            variant={isLive ? 'default' : 'outline'}
            onClick={() => setIsLive(!isLive)}
            disabled={device.status === 'offline'}
          >
            {isLive ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
            {isLive ? 'Pause' : 'Resume'}
          </Button>

          {/* View Mode Selector */}
          <div className="flex items-center bg-background border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode('list')}
            >
              <List className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant={viewMode === 'compact' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-2"
              onClick={() => setViewMode('compact')}
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const TelemetryView = ({ sensors }: { sensors: Sensor[] }) => {
    return (
      <>
        {/* Telemetry Content - Scrollable */}
        <div className="max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
          {sensors.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Radio className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-slate-900 mb-1">No Active Sensors</h4>
              <p className="text-slate-600 text-sm">This device has no active sensors to display</p>
            </Card>
          ) : (
            <>
              {viewMode === 'grid' && <DeviceSensorTelemtryGridView sensors={sensors} />}
              {/* {viewMode === 'list' && <ListView />} */}
              {/* {viewMode === 'compact' && <CompactView />} */}
            </>
          )}
        </div>

        {/* Inactive Sensors Notice */}
        {/* {inactiveSensors.length > 0 && ( */}
        {/*   <Card className="p-4 bg-amber-50 border-amber-200"> */}
        {/*     <div className="flex items-center gap-2 text-amber-700"> */}
        {/*       <Activity className="w-4 h-4" /> */}
        {/*       <span className="text-sm"> */}
        {/*         {inactiveSensors.length} inactive sensor{inactiveSensors.length !== 1 ? 's' : ''} not shown */}
        {/*       </span> */}
        {/*     </div> */}
        {/*   </Card> */}
        {/* )} */}
      </>
    )
  }

  return (
    <>
      {sensorsStatus != "pending" ?
        sensors && (
          <>
            <div className="flex flex-1 flex-col">
              <TitleSection />
              <TelemetryView sensors={sensors} />
            </div>
          </>
        )
        :
        (
          <>
          </>
        )
      }
    </>
  )
}

