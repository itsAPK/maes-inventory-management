'use client';

import { TrendingUp } from 'lucide-react';
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

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
import { MonthlyTarget } from '../user/monthly-target';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const chartConfig = {
  sales: {
    label: 'Sales',
  },
  batteries: {
    label: 'batteries',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

import { useMemo } from 'react'; // Import useMemo for performance optimization

export function TargetGraph({ sales }: { sales: number }) {
  const chartData = [{ browser: 'batteries', sales: sales, fill: 'var(--color-batteries)' }];

  const monthlyTarget = useQuery({
    queryKey: ['get-monthly-target'],
    queryFn: async (): Promise<any> => {
      return await api
        .post('/target/query', {
          query: [
            {
              $match: {
                year: String(new Date().getFullYear()),
                month: String(new Date().getMonth() + 1),
              },
            },
            {
              $sort: { updated_at: -1 },
            },
          ],
        })
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data.message);
          }
          return res.data.data;
        })
        .catch((err) => {
          throw err;
        });
    },
  });

  // Calculate the end angle based on target and actual sales
  const endAngle = useMemo(() => {
    const target = monthlyTarget.data?.data[0]?.target || 10; // Default target
    const actualsales = chartData[0].sales; // Actual sales from chartData
    const proportion = Math.min(actualsales / target, 1); // Ensure it doesn't exceed 1
    return proportion * 360; // Convert to degrees
  }, [monthlyTarget.data]);

  return (
    <Card className="flex flex-col rounded shadow-none">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>Monthly Target </CardTitle>
          <MonthlyTarget />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[290px]">
          <RadialBarChart
            data={chartData}
            endAngle={endAngle} // Use calculated end angle here
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="sales" background />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {monthlyTarget.data && monthlyTarget.data.data.length > 0
                            ? monthlyTarget.data.data[0].target
                            : 10}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Batteries
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
