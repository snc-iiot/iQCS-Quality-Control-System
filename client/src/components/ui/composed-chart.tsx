import { FC } from "react";
import { Area, Bar, CartesianGrid, ComposedChart as ComposedRechart, Line, XAxis, YAxis } from "recharts";
import { CurveType } from "recharts/types/shape/Curve";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, CustomizedLabel } from "./chart";

type TComposedChart = {
  data: {
    label: string;
    [key: string]: string | number;
  }[];
  Config?: ({ key: string; color?: string; yAxisId?: "right"; label?: true | string } & (
    | { chart?: "Ber"; type?: string }
    | { chart?: "Line" | "Area"; type?: CurveType }
  ))[];
};

const ComposedChart: FC<TComposedChart> = ({ data, Config }) => {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const dataObjectKeys = Object?.keys(data[0]);
  const YAxisRight = Config?.find(({ yAxisId }) => yAxisId === "right");

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
      <ComposedRechart accessibilityLayer data={data}>
        <CartesianGrid vertical={true} />
        <YAxis
          domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
          tickFormatter={(value) => `${value?.toLocaleString("en")}`}
        />
        {YAxisRight && (
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
            tickFormatter={(value) => `${value}`}
          />
        )}
        <XAxis dataKey={dataObjectKeys[0]} tickLine={true} tickMargin={10} axisLine={false} />

        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
        {dataObjectKeys?.slice(1)?.map((key) => {
          const configItem = Config?.find((k) => k?.key === key);

          return configItem?.chart === "Line" ? (
            <Line
              type={configItem?.type}
              dataKey={key}
              stroke={configItem?.color ?? "#102693"}
              label={
                configItem?.label ? (
                  <CustomizedLabel unit={typeof configItem?.label === "string" ? configItem?.label : ""} />
                ) : (
                  <></>
                )
              }
              yAxisId={configItem?.yAxisId}
            />
          ) : configItem?.chart === "Area" ? (
            <Area
              type={configItem?.type}
              dataKey={key}
              stroke={configItem?.color ?? "#102693"}
              label={
                configItem?.label ? (
                  <CustomizedLabel unit={typeof configItem?.label === "string" ? configItem?.label : ""} />
                ) : (
                  <></>
                )
              }
              yAxisId={configItem?.yAxisId}
            />
          ) : (
            <Bar
              type={`${configItem?.type}`}
              dataKey={key}
              fill={configItem?.color ?? "#102693"}
              label={
                configItem?.label ? (
                  <CustomizedLabel unit={typeof configItem?.label === "string" ? configItem?.label : ""} />
                ) : (
                  <></>
                )
              }
              yAxisId={configItem?.yAxisId}
            />
          );
        })}
      </ComposedRechart>
    </ChartContainer>
  );
};

export default ComposedChart;
