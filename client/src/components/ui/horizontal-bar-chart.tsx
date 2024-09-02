"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { FC } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";

const chartConfig = {
  value: {
    label: "value",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

const colors = [
  "hsl(var(--chart-horizontal-bar-chart-1))",
  "hsl(var(--chart-horizontal-bar-chart-2))",
  "hsl(var(--chart-horizontal-bar-chart-3))",
  "hsl(var(--chart-horizontal-bar-chart-4))",
  "hsl(var(--chart-horizontal-bar-chart-5))",
  "hsl(var(--chart-horizontal-bar-chart-6))",
  "hsl(var(--chart-horizontal-bar-chart-7))",
  "hsl(var(--chart-horizontal-bar-chart-8))",
  "hsl(var(--chart-horizontal-bar-chart-9))",
  "hsl(var(--chart-horizontal-bar-chart-10))",
];

export type THorizontalBarChart = {
  data: { label: string; value: number }[];
};

const HorizontalBarChart: FC<THorizontalBarChart> = ({ data }) => {
  const getBarColor = (index: number) => colors[index % colors.length];

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart
        accessibilityLayer
        layout="vertical"
        margin={{
          right: 16,
        }}
        className="h-full"
        {...{ data }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="label"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
          hide
        />
        <XAxis dataKey="value" type="number" hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Bar dataKey="value" layout="vertical" radius={4}>
          {data?.map((_, index) => <Cell key={`cell-${index}`} fill={getBarColor(index)} />)}
          <LabelList
            dataKey="label"
            position="insideLeft"
            offset={8}
            className="fill-[--color-label] font-bold"
            fontSize={12}
          />
          <LabelList dataKey="value" position="right" offset={8} className="fill-foreground font-bold" fontSize={12} />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};

export { HorizontalBarChart };
