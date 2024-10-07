'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

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

export const description = 'A donut chart with text';

const chartConfig = {
  sales: {
    label: 'Sales',
  },
  paid: {
    label: 'Paid',
    color: 'hsl(var(--chart-2))',
  },
  unpaid: {
    label: '',
    color: 'hsl(var(--destructive))',
  },
  partial: {
    label: 'Firefox',
    color: 'hsl(var(--primary))',
  },
  notUpdated: {
    label: 'Not Updated',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function OverallPaymentStatus({
  data,
  remainingAmount,
}: {
  data: { paid: number; unpaid: number; notupdated: number; partial: number };
  remainingAmount: number;
}) {
  const chartData = [
    { status: 'paid', sales: data.paid, fill: 'var(--color-paid)' },
    { status: 'unpaid', sales: data.unpaid, fill: 'var(--color-unpaid)' },
    { status: 'partial', sales: data.partial, fill: 'var(--color-partial)' },
    { status: 'notUpdated', sales: data.notupdated, fill: 'var(--color-notUpdated)' },
  ];
  const totalsales = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.sales, 0);
  }, []);

  return (
    <Card className="flex min-h-[345px] flex-col rounded shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Overall Payment Status</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="sales" nameKey="status" innerRadius={60} strokeWidth={5}>
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
                          className="fill-foreground text-base font-bold"
                        >
                          ₹ {remainingAmount}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Remaining
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
