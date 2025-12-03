import { memo, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  YAxis,
} from 'recharts';
import type { Sensor, SensorType } from '@/types/device/index';
import { useDeviceTelemetry } from '@/hooks/queries/use-device-telemetry';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../ui/chart';

interface SensorChartProps {
  sensor: Sensor;
}

const chartConfig = {
  minValue: { label: "min", color: "var(--border)", },
  maxValue: { label: "max", color: "var(--border)", },
  avgValue: { label: "avg", color: "var(--accent-green)", },
} satisfies ChartConfig

const COLOR_MAP: Record<
  SensorType,
  { fill: string; stroke: string }
> = {
  TEMPERATURE: {
    fill: "url(#fillOrange)",
    stroke: "var(--color-accent-orange)",
  },
  LIGHT_INTENSITY: {
    fill: "url(#fillYellow)",
    stroke: "var(--color-accent-yellow)",
  },
  HUMIDITY: {
    fill: "url(#fillBlue)",
    stroke: "var(--color-accent-blue)",
  },
  MOISTURE: {
    fill: "url(#fillBlue)",
    stroke: "var(--color-accent-blue)",
  },
  PH: {
    fill: "url(#fillPurple)",
    stroke: "var(--color-accent-purple)",
  },
  PRESSURE: {
    fill: "url(#fillGreen)",
    stroke: "var(--color-accent-green)",
  },
  NPK: {
    fill: "url(#fillGreen)",
    stroke: "var(--color-accent-green)",
  },
  WIND_SPEED: {
    fill: "url(#fillGreen)",
    stroke: "var(--color-accent-green)",
  },
};

const GradientDefs = memo(() => (
  <defs>
    {[
      ["fillOrange", "var(--color-accent-orange)"],
      ["fillGreen", "var(--color-accent-green)"],
      ["fillBlue", "var(--color-accent-blue)"],
      ["fillYellow", "var(--color-accent-yellow)"],
      ["fillPurple", "var(--color-accent-purple)"],
    ].map(([id, color]) => (
      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={color} stopOpacity={0.8} />
        <stop offset="95%" stopColor={color} stopOpacity={0.1} />
      </linearGradient>
    ))}
  </defs>
));
GradientDefs.displayName = "GradientDefs";

export function SensorChart({
  sensor,
}: SensorChartProps) {

  const dateRange = useMemo(() => {
    const from = new Date();
    from.setDate(1);
    return { from, to: new Date() };
  }, []);

  const { data } = useDeviceTelemetry(sensor.device_id, sensor.id, {
    from: dateRange.from,
    to: dateRange.to,
    groupBy: "second",
    limit: 20
  })

  const chartData = useMemo(() => data, [data]);
  // stable color lookup

  if (!data) return null;

  const color = COLOR_MAP[sensor.type] ?? {
    fill: "url(#fillGreen)",
    stroke: "var(--color-accent-green)",
  };

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        data={chartData}
        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="bucket"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => (new Date(value)).toLocaleTimeString("en")}
        />
        <YAxis
          type='number'
          dataKey="avgValue"
          axisLine={false}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillOrange" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={`var(--color-accent-orange)`}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-accent-orange)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={`var(--color-accent-green)`}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-accent-green)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={`var(--color-accent-blue)`}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-accent-blue)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillYellow" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={`var(--color-accent-yellow)`}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-accent-yellow)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillPurple" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={`var(--color-accent-purple)`}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-accent-purple)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillAvg" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={`var(--color-accent-purple)`}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-accent-purple)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="avgValue"
          type="natural"
          fill={color.fill}
          fillOpacity={0.2}
          strokeWidth={2}
          stroke={color.stroke}
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
