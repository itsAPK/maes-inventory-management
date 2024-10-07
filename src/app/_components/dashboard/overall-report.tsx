'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  amount: {
    label: 'Amount',
  },
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
  purchases: {
    label: 'Cost',
    color: 'hsl(var(--chart-2))',
  },
  profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export const OverallReport = ({
  sales,
  purchases,
  profit,
}: {
  sales: number;
  purchases: number;
  profit: number;
}) => {
  const chartData: any = [
    {
      voucher: 'sales',
      amount: sales,
      fill: 'var(--color-sales)',
    },
    {
      voucher: 'purchases',
      amount: purchases,
      fill: 'var(--color-purchases)',
    },
    {
      voucher: 'profit',
      amount: profit,
      fill: 'var(--color-profit)',
    },
  ];

  console.log(chartData);

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc: any, curr: { amount: any }) => acc + curr.amount, 0);
  }, []);
  return (
    <Card className="flex min-h-[200px] flex-col rounded shadow-none">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Overall Report</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 pt-10">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[290px]">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
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
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="voucher"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {purchases ? ((profit / purchases) * 100).toFixed(1) : 0}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Profit
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="voucher" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
