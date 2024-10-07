'use client';

import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DailyData } from '@/types';
const chartData = [
  { date: '2024-04-01', sales: 222, purchases: 150 },
  { date: '2024-04-02', sales: 97, purchases: 180 },
  { date: '2024-04-03', sales: 167, purchases: 120 },
  { date: '2024-04-04', sales: 242, purchases: 260 },
  { date: '2024-04-05', sales: 373, purchases: 290 },
  { date: '2024-04-06', sales: 301, purchases: 340 },
  { date: '2024-04-07', sales: 245, purchases: 180 },
  { date: '2024-04-08', sales: 409, purchases: 320 },
  { date: '2024-04-09', sales: 59, purchases: 110 },
  { date: '2024-04-10', sales: 261, purchases: 190 },
  { date: '2024-04-11', sales: 327, purchases: 350 },
  { date: '2024-04-12', sales: 292, purchases: 210 },
  { date: '2024-04-13', sales: 342, purchases: 380 },
  { date: '2024-04-14', sales: 137, purchases: 220 },
  { date: '2024-04-15', sales: 120, purchases: 170 },
  { date: '2024-04-16', sales: 138, purchases: 190 },
  { date: '2024-04-17', sales: 446, purchases: 360 },
  { date: '2024-04-18', sales: 364, purchases: 410 },
  { date: '2024-04-19', sales: 243, purchases: 180 },
  { date: '2024-04-20', sales: 89, purchases: 150 },
  { date: '2024-04-21', sales: 137, purchases: 200 },
  { date: '2024-04-22', sales: 224, purchases: 170 },
  { date: '2024-04-23', sales: 138, purchases: 230 },
  { date: '2024-04-24', sales: 387, purchases: 290 },
  { date: '2024-04-25', sales: 215, purchases: 250 },
  { date: '2024-04-26', sales: 75, purchases: 130 },
  { date: '2024-04-27', sales: 383, purchases: 420 },
  { date: '2024-04-28', sales: 122, purchases: 180 },
  { date: '2024-04-29', sales: 315, purchases: 240 },
  { date: '2024-04-30', sales: 454, purchases: 380 },
  { date: '2024-05-01', sales: 165, purchases: 220 },
  { date: '2024-05-02', sales: 293, purchases: 310 },
  { date: '2024-05-03', sales: 247, purchases: 190 },
  { date: '2024-05-04', sales: 385, purchases: 420 },
  { date: '2024-05-05', sales: 481, purchases: 390 },
  { date: '2024-05-06', sales: 498, purchases: 520 },
  { date: '2024-05-07', sales: 388, purchases: 300 },
  { date: '2024-05-08', sales: 149, purchases: 210 },
  { date: '2024-05-09', sales: 227, purchases: 180 },
  { date: '2024-05-10', sales: 293, purchases: 330 },
  { date: '2024-05-11', sales: 335, purchases: 270 },
  { date: '2024-05-12', sales: 197, purchases: 240 },
  { date: '2024-05-13', sales: 197, purchases: 160 },
  { date: '2024-05-14', sales: 448, purchases: 490 },
  { date: '2024-05-15', sales: 473, purchases: 380 },
  { date: '2024-05-16', sales: 338, purchases: 400 },
  { date: '2024-05-17', sales: 499, purchases: 420 },
  { date: '2024-05-18', sales: 315, purchases: 350 },
  { date: '2024-05-19', sales: 235, purchases: 180 },
  { date: '2024-05-20', sales: 177, purchases: 230 },
  { date: '2024-05-21', sales: 82, purchases: 140 },
  { date: '2024-05-22', sales: 81, purchases: 120 },
  { date: '2024-05-23', sales: 252, purchases: 290 },
  { date: '2024-05-24', sales: 294, purchases: 220 },
  { date: '2024-05-25', sales: 201, purchases: 250 },
  { date: '2024-05-26', sales: 213, purchases: 170 },
  { date: '2024-05-27', sales: 420, purchases: 460 },
  { date: '2024-05-28', sales: 233, purchases: 190 },
  { date: '2024-05-29', sales: 78, purchases: 130 },
  { date: '2024-05-30', sales: 340, purchases: 280 },
  { date: '2024-05-31', sales: 178, purchases: 230 },
  { date: '2024-06-01', sales: 178, purchases: 200 },
  { date: '2024-06-02', sales: 470, purchases: 410 },
  { date: '2024-06-03', sales: 103, purchases: 160 },
  { date: '2024-06-04', sales: 439, purchases: 380 },
  { date: '2024-06-05', sales: 88, purchases: 140 },
  { date: '2024-06-06', sales: 294, purchases: 250 },
  { date: '2024-06-07', sales: 323, purchases: 370 },
  { date: '2024-06-08', sales: 385, purchases: 320 },
  { date: '2024-06-09', sales: 438, purchases: 480 },
  { date: '2024-06-10', sales: 155, purchases: 200 },
  { date: '2024-06-11', sales: 92, purchases: 150 },
  { date: '2024-06-12', sales: 492, purchases: 420 },
  { date: '2024-06-13', sales: 81, purchases: 130 },
  { date: '2024-06-14', sales: 426, purchases: 380 },
  { date: '2024-06-15', sales: 307, purchases: 350 },
  { date: '2024-06-16', sales: 371, purchases: 310 },
  { date: '2024-06-17', sales: 475, purchases: 520 },
  { date: '2024-06-18', sales: 107, purchases: 170 },
  { date: '2024-06-19', sales: 341, purchases: 290 },
  { date: '2024-06-20', sales: 408, purchases: 450 },
  { date: '2024-06-21', sales: 169, purchases: 210 },
  { date: '2024-06-22', sales: 317, purchases: 270 },
  { date: '2024-06-23', sales: 480, purchases: 530 },
  { date: '2024-06-24', sales: 132, purchases: 180 },
  { date: '2024-06-25', sales: 141, purchases: 190 },
  { date: '2024-06-26', sales: 434, purchases: 380 },
  { date: '2024-06-27', sales: 448, purchases: 490 },
  { date: '2024-06-28', sales: 149, purchases: 200 },
  { date: '2024-06-29', sales: 103, purchases: 160 },
  { date: '2024-06-30', sales: 446, purchases: 400 },
];

const chartConfig = {
  views: {
    label: 'Stocks',
  },
  sales: {
    label: 'Sold',
    color: 'hsl(var(--primary))',
  },
  purchases: {
    label: 'Purchased',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export function TotalStocks({
  stocks,
  total,
}: {
  stocks: DailyData[];
  total: { sales: number; purchases: number };
}) {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>('sales');

  return (
    <Card className="rounded shadow-none">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Stocks Overview</CardTitle>
        </div>
        <div className="flex">
          {['sales', 'purchases'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={stocks}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className=""
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
