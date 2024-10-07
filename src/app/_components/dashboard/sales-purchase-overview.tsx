'use client';

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CombinedOverviewEntry } from '@/types';

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
  purchases: {
    label: 'Purchases',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function SalesPurchaseOverview({ data }: { data: CombinedOverviewEntry[] }) {
  return (
    <Card className="rounded shadow-none">
      <CardHeader>
        <CardTitle>Sales & Purchases Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={data}>
            <defs>
              <filter id="shadowSales" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="7" result="blur" />
                <feOffset in="blur" dx="0" dy="7" result="offsetBlur" />
                <feFlood floodColor="hsl(var(--chart-1))" floodOpacity="1" result="offsetColor" />
                <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <defs>
              <filter id="shadowPurchaes" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="7" result="blur" />
                <feOffset in="blur" dx="0" dy="7" result="offsetBlur" />
                <feFlood floodColor="hsl(var(--chart-2))" floodOpacity="1" result="offsetColor" />
                <feComposite in="offsetColor" in2="offsetBlur" operator="in" result="offsetBlur" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="views"
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
            />{' '}
            <Line
              filter="url(#shadowSales)"
              dataKey="sales"
              type="monotone"
              stroke="var(--color-sales)"
              strokeWidth={2}
              dot={{
                fill: 'var(--color-sales)',
              }}
              activeDot={{
                r: 6,
              }}
            >
              {' '}
            </Line>
            <Line
              filter="url(#shadowPurchaes)"
              dataKey="purchases"
              type="monotone"
              stroke="var(--color-purchases)"
              strokeWidth={2}
              dot={{
                fill: 'var(--color-purchases)',
              }}
              activeDot={{
                r: 6,
              }}
            >
              {' '}
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
