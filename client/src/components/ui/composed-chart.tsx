import { FileChartPie } from "lucide-react";
import { FC } from "react";
import { Area, Bar, CartesianGrid, ComposedChart as ComposedRechart, LabelList, Line, XAxis, YAxis } from "recharts";
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
  enableLabelList?: boolean;
  emptyLabel?: string;
};

const ComposedChart: FC<TComposedChart> = ({
  data,
  Config,
  enableLabelList = false,
  emptyLabel = "No data available for this period of time or defect type",
}) => {
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

  if (data?.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-sm">
        <FileChartPie className="h-10 w-10 text-gray-400" strokeWidth={1.5} />
        {emptyLabel}
      </div>
    );
  }

  const dataObjectKeys = Object?.keys(data?.[0]);
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
              key={`line-${key}`}
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
              key={`area-${key}`}
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
              key={`bar-${key}`}
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
            >
              {enableLabelList && <LabelList dataKey={key} position="top" fontSize={10} />}
            </Bar>
          );
        })}
      </ComposedRechart>
    </ChartContainer>
  );
};

export default ComposedChart;
