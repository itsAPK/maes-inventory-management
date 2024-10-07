'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CombinedStocks } from '@/types';
const chartData = [
  { month: 'January', opening: 186, closing: 80 },
  { month: 'February', opening: 305, closing: 200 },
  { month: 'March', opening: 237, closing: 120 },
  { month: 'April', opening: 73, closing: 190 },
  { month: 'May', opening: 209, closing: 130 },
  { month: 'June', opening: 214, closing: 140 },
];

const chartConfig = {
  opening: {
    label: 'Sold',
    color: 'hsl(var(--chart-1))',
  },
  closing: {
    label: 'Purchased',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function OpenCloseStocksOverview({ data }: { data: CombinedStocks[] }) {
  return (
    <Card className="rounded shadow-none">
      <CardHeader>
        <CardTitle>Sold vs Purchased Stocks</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="views"
                  hideLabel
                  indicator="dot"
                  formatter={(value, name) => (
                    <>
                      <div
                        className="mt-1 h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={
                          {
                            '--color-bg': `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      <div className="flex flex-col text-xs text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label || name}

                        <div className="flex items-baseline font-mono font-medium tabular-nums text-foreground">
                          {Number(value)}
                        </div>
                      </div>
                    </>
                  )}
                />
              }
            />
            <Bar dataKey="opening" fill="var(--color-opening)" radius={4} />
            <Bar dataKey="closing" fill="var(--color-closing)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
