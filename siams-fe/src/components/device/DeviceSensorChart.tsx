import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Sensor } from '@/types/device';
import { useDeviceTelemetry } from '@/hooks/queries/use-device-telemetry';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../ui/chart';

interface SensorChartProps {
  title: string;
  sensor: Sensor;
  type: 'line' | 'area' | 'bar';
  color: string;
}

const chartConfig = {
  minValue: {
    label: "min",
    color: "var(--border)",
  },
  maxValue: {
    label: "max",
    color: "var(--border)",
  },
  avgValue: {
    label: "avg",
    color: "var(--accent-green)",
  },
} satisfies ChartConfig

export function SensorChart({
  title,
  sensor,
  type,
  color
}: SensorChartProps) {
  const { data, status } = useDeviceTelemetry(sensor.deviceId, sensor.id)

  if (!data) return;

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 5, left: -20, bottom: 5 },
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="bucket"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => (new Date(value)).toLocaleTimeString("en")}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillMin" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-border)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-border)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMax" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-border)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-border)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAvg" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-accent-blue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-accent-blue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            {/* <Area */}
            {/*   dataKey="minValue" */}
            {/*   type="natural" */}
            {/*   fill="url(#fillMin)" */}
            {/*   fillOpacity={0.4} */}
            {/*   stroke="var(--color-border)" */}
            {/*   stackId="a" */}
            {/* /> */}
            {/* <Area */}
            {/*   dataKey="maxValue" */}
            {/*   type="natural" */}
            {/*   fill="url(#fillMax)" */}
            {/*   fillOpacity={0.4} */}
            {/*   stroke="var(--color-border)" */}
            {/*   stackId="a" */}
            {/* /> */}
            <Area
              dataKey="avgValue"
              type="natural"
              fill="url(#fillAvg)"
              fillOpacity={0.4}
              strokeWidth={2}
              stroke="var(--color-accent-blue)"
              stackId="a"
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
          </BarChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
          </LineChart>
        );
    }
  };

  return (
    <ChartContainer config={chartConfig}>
      {renderChart()}
    </ChartContainer>
  );
}
