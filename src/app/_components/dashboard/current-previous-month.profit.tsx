'use client';

import { TrendingUp } from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  BarChart,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
  { name: 'Profit', current: 186, previous: 80 },
  { name: 'Sale', current: 305, previous: 200 },
  { name: 'Cost', current: 237, previous: 120 },
];

const chartConfig = {
  current: {
    label: 'Current Month',
    color: 'hsl(var(--chart-1))',
  },
  previous: {
    label: 'Previous Month',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function CurrentVsPreviousCostAnalysis({
  data,
}: {
  data: { name: string; current: string; previous: string }[];
}) {
  return (
    <Card className="min-h-[350px] rounded shadow-none">
      <CardHeader className="items-center pb-4">
        <CardTitle>Current vs Previous Month Cost Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="views"
                  hideLabel
                  formatter={(value, name) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={
                          {
                            '--color-bg': `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      <div className="flex flex-col text-xs text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label || name}

                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          <span className="font-normal text-muted-foreground">₹</span>
                          {Number(value).toFixed(2)}
                        </div>
                      </div>
                    </>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="current"
              stackId="a"
              fill="var(--color-current)"
              radius={[0, 0, 4, 4]}
              barSize={50}
            />
            <Bar
              dataKey="previous"
              stackId="a"
              fill="var(--color-previous)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
