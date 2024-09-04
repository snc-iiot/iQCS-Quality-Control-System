import { cn } from "@/lib/utils";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, CustomizedLabel } from "../ui/chart";

const LineBarComposedChart = () => {
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

  const data = [
    {
      label: "Body",
      produce: 1480,
      defect: 50,
      percent: 3.38,
    },
    {
      label: "Middle Drawer",
      produce: 3258,
      defect: 45,
      percent: 1.38,
    },
    {
      label: "Small Drawer",
      produce: 1129,
      defect: 40,
      percent: 3.54,
    },
    {
      label: "Top Cover",
      produce: 1590,
      defect: 28,
      percent: 1.76,
    },
    {
      label: "Bottom",
      produce: 1200,
      defect: 17,
      percent: 1.42,
    },
  ];
  return (
    <div className="flex h-[25rem] flex-col gap-2 rounded-md border p-2">
      <div className="flex flex-col justify-between gap-2 md:flex-row lg:flex-row">
        <div className={cn("w-full")}>
          <h1 className="text-sm font-semibold">
            การผลิตทั้งหมดเทียบกับงานเสีย / Total production compared to ng work
          </h1>
          <p className="text-xs text-muted-foreground">รายการสาเหตุที่ทำให้งานเสียของแต่ละ ชิ้นงาน ในกระบวนการ </p>
        </div>
      </div>
      <div className="flex h-0 flex-grow flex-col">
        {data?.length === 0 ? (
          <div className="flex w-full justify-center">
            <p className="text-xs">
              {/* {isLoadingSummaryDefectsByPartGraph
                ? "กำลังโหลดข้อมูล / Loading data"
                : partSelected
                  ? "เลือกชิ้นงานที่ต้องการดู / Select the part you want to see"
                  : "ไม่พบข้อมูล / No data found"} */}
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
            <ComposedChart accessibilityLayer data={data}>
              <CartesianGrid vertical={true} />
              <YAxis
                yAxisId="left"
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
                tickFormatter={(value) => `${value?.toLocaleString("en")}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
                tickFormatter={(value) => `${value} %`}
              />
              <XAxis dataKey="label" tickLine={true} tickMargin={10} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
              <Bar yAxisId="left" dataKey={"produce"} fill={"#102693"} />
              <Bar yAxisId="left" dataKey={"defect"} fill={"#FF2020"} />
              <Line yAxisId="right" type="linear" dataKey="percent" stroke="#ff7300" label={<CustomizedLabel />} />
            </ComposedChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
};

export default LineBarComposedChart;
