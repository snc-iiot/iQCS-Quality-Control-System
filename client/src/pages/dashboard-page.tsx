import { PageHeader } from "@/components/common/page-header";
import { CardProcess } from "@/components/ui-pattern";
import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { HorizontalBarChart } from "@/components/ui/horizontal-bar-chart";
import { Input } from "@/components/ui/input";
import { useDashboardHelper } from "@/helpers/dashboard.helper";
import { getStartDateEndDateOfWeek, getWeekString, renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { cn } from "@/lib/utils";
import { useDefect } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TGraphSummary, TPartSummary } from "@/types";
import { FC, Fragment, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export const DashboardPage: FC = () => {
  const [selected, setSelected] = useState({
    type: "daily",
    start_date: renderFormattedPayloadDate(new Date()) ?? "",
    end_date: "",
  });

  const { useGetSummaryDefectsByDateGraph, useGetTopDefects, useGetSummaryDefectsByPartGraph } = useDefect();

  const { graphSummaryList, topDefectList, processList, partSummaryList } = useAtomStore();
  const [shiftSelected, setShiftSelected] = useState<string>("ALL");
  const { groupProcess, groupDate } = useDashboardHelper(
    graphSummaryList
      ?.filter((item) => (shiftSelected == "ALL" ? true : item?.shift === shiftSelected))
      ?.map((info) => ({ ...info, date: info?.datetime.slice(0, 10) }))
  );

  console.log(topDefectList);

  const [processSelected, setProcessSelected] = useState<string>("ALL");
  const [processPartSelected, setProcessPartSelected] = useState<string>(processList[0]?.process_id);
  const [ranking, setRanking] = useState<number>(10);
  const [partSelected, setPartSelected] = useState<string>("");

  const mapCardProcess = processList?.map((process) => {
    const data = groupProcess("process_name")[process?.process_name];
    const total = data?.reduce((acc, curr) => acc + curr?.ng_quantity, 0) ?? 0;
    const ng = data?.reduce((acc, curr) => acc + curr?.ng_quantity, 0) ?? 0;
    return {
      process,
      total,
      ng,
      raw_data: data,
    };
  });

  const getDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];

    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      const day = String(dt.getDate()).padStart(2, "0");
      const month = String(dt.getMonth() + 1).padStart(2, "0");
      const year = dt.getFullYear();
      dates.push(`${year}-${month}-${day}`);
    }

    return dates;
  };

  const defectData = (process: string) => {
    const dataTimeSlot = groupProcess("time_slot");
    const dateRange = getDateRange(selected?.start_date, selected?.end_date);
    const dataGroupDate = groupDate(dateRange);

    if (selected?.type === "daily") {
      const data = Object.keys(dataTimeSlot)?.map((key) => {
        return {
          ...dataTimeSlot[key]
            ?.filter((item) =>
              process === "ALL"
                ? true
                : item?.process_name === processList?.find((info) => info?.process_id === process)?.process_name
            )
            ?.reduce(
              (acc, curr) => {
                return {
                  ...acc,
                  [curr?.process_name]: curr?.ng_quantity,
                };
              },
              { time_slot: key }
            ),
        };
      });
      return data;
    } else {
      const data = dateRange?.map((key) => {
        const { groupProcess } = useDashboardHelper(dataGroupDate[key] as TGraphSummary[]);
        const dataGroupProcess = groupProcess("process_name");

        const dataChart = processList.reduce(
          (acc, info) => {
            acc[info?.process_name] =
              dataGroupProcess[info?.process_name]?.reduce((sum, curr) => sum + curr?.ng_quantity, 0) ?? 0;
            return acc;
          },
          {} as Record<string, number>
        );

        return {
          time_slot: key,
          ...dataChart,
        };
      });

      return data;
    }
  };

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

  const { isFetching: isLoadingSummaryDefectsByDateGraph } = useGetSummaryDefectsByDateGraph(
    selected?.start_date,
    selected?.type === "daily" ? selected?.start_date : selected?.end_date
  );
  const { isFetching: isLoadingTopDefects } = useGetTopDefects(
    selected?.start_date,
    selected?.type === "daily" ? selected?.start_date : selected?.end_date,
    processSelected,
    shiftSelected,
    ranking
  );
  const { isFetching: isLoadingSummaryDefectsByPartGraph, refetch: refetchSummaryDefectsByPartGraph } =
    useGetSummaryDefectsByPartGraph(
      selected?.start_date,
      selected?.type === "daily" ? selected?.start_date : selected?.end_date,
      processPartSelected
    );

  const getPartSummaryList = (partSummaryList: TPartSummary[], partSelected: string) => {
    return (
      partSummaryList
        ?.find((item) => item?.part_name === partSelected)
        ?.details?.map((item) => ({
          label: item?.case_name,
          ng_quantity: item?.ng_quantity ?? 0,
        })) ?? []
    );
  };

  useEffect(() => {
    setProcessPartSelected(graphSummaryList?.find((info) => info?.ng_quantity > 0)?.process_id ?? "");
  }, [isLoadingSummaryDefectsByDateGraph === false]);
  useEffect(() => {
    setPartSelected(partSummaryList[0]?.part_name ?? "");
  }, [isLoadingSummaryDefectsByPartGraph === false]);

  return (
    <div className="flex h-full w-full flex-col space-y-2 overflow-y-auto p-2">
      <div className="flex h-max w-full flex-col justify-between gap-2 md:flex-row lg:flex-row">
        <PageHeader title="ภาพรวม / Dashboard" description="ภาพรวมของระบบ" />
        <div className="flex w-full flex-col gap-2 md:w-min md:flex-row">
          <SelectForm
            value={selected?.type}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "week") {
                const [year, week] = getWeekString(new Date(selected?.start_date)).split("-W");
                const YEAR = parseInt(year);
                const WEEK = parseInt(week);
                const { startDate: start_date, endDate: end_date } = getStartDateEndDateOfWeek(WEEK, YEAR);
                setSelected({
                  ...selected,
                  type: e.target.value,
                  start_date: renderFormattedPayloadDate(new Date(start_date)) ?? "",
                  end_date: renderFormattedPayloadDate(new Date(end_date)) ?? "",
                });
              } else if (value == "period") {
                setSelected({
                  ...selected,
                  type: e.target.value,
                  end_date: selected?.start_date,
                });
              } else {
                setSelected({
                  ...selected,
                  type: e.target.value,
                });
              }
            }}
            options={[
              {
                label: "รายวัน / Daily",
                value: "daily",
              },
              {
                label: "ช่วงวัน / Period",
                value: "period",
              },
              {
                label: "สัปดาห์ / Week",
                value: "week",
              },
              {
                label: "รายเดือน / Monthly",
                value: "monthly",
              },
            ]}
            className="w-[10rem]"
          />
          {selected?.type === "week" && (
            <Input
              onChange={(e) => {
                const value = e.target.value;
                const [year, week] = value.split("-W");
                const YEAR = parseInt(year);
                const WEEK = parseInt(week);
                const { startDate: start_date, endDate: end_date } = getStartDateEndDateOfWeek(WEEK, YEAR);
                setSelected({
                  ...selected,
                  start_date: renderFormattedPayloadDate(new Date(start_date)) ?? "",
                  end_date: renderFormattedPayloadDate(new Date(end_date)) ?? "",
                });
              }}
              value={getWeekString(new Date(selected?.start_date))}
              className="block w-full md:w-[14rem] lg:w-[10rem]"
              type="week"
            />
          )}

          {(selected?.type === "daily" || selected?.type === "period" || selected?.type === "monthly") && (
            <Input
              className="block w-full md:w-[14rem] lg:w-[10rem]"
              value={selected?.start_date?.slice(0, selected?.type === "monthly" ? 7 : 10)}
              onChange={(e) => {
                const start_date = e.target.value + (selected?.type === "monthly" ? "-01" : "");
                let end_date = selected?.end_date;

                if (selected?.type === "monthly") {
                  const [year, month] = start_date.split("-");
                  const endOfMonth = new Date(Number(year), Number(month), 0);
                  end_date = `${year}-${month}-${endOfMonth.getDate()}`;
                }

                setSelected({
                  ...selected,
                  start_date,
                  end_date,
                });
              }}
              type={selected?.type === "monthly" ? "month" : "date"}
            />
          )}

          {selected?.type === "period" && (
            <Input
              className="block w-full md:w-[14rem] lg:w-[10rem]"
              value={selected?.end_date}
              onChange={(e) => setSelected({ ...selected, end_date: e.target.value })}
              type="date"
              min={selected?.start_date}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-7">
        {mapCardProcess?.map((process) => (
          <CardProcess
            key={process?.process?.process_name}
            title={process?.process?.process_name}
            value={process?.ng}
            isActive={processSelected === process?.process?.process_id}
            onClick={() => {
              if (processSelected === process?.process?.process_id) {
                setProcessSelected("ALL");
              }
              if (processSelected !== process?.process?.process_id) {
                setProcessSelected(process?.process?.process_id);
              }
            }}
            color={process?.process?.process_color}
          />
        ))}
      </div>
      <div className="grid h-max grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2">
        {/*//! Top Rank Chart  */}
        <div className="flex h-[25rem] flex-col gap-2 rounded-md border p-2">
          <div className="flex">
            <div className={cn("w-full")}>
              <h1 className="text-sm font-semibold">
                {ranking} สาเหตุที่ทำให้งานเสียมากที่สุด / Top {ranking} causes that cause the most defects
              </h1>
              <p className="text-xs text-muted-foreground">
                รายการสาเหตุที่ทำให้งานเสียมากที่สุด / List of causes that cause the most work loss
              </p>
            </div>
            <SelectForm
              value={String(ranking)}
              onChange={(e) => {
                setRanking(Number(e.target.value));
              }}
              options={[
                {
                  label: "10",
                  value: "10",
                },
                {
                  label: "15",
                  value: "15",
                },
                {
                  label: "20",
                  value: "20",
                },
              ]}
              className="w-[6rem]"
            />
          </div>
          <div className="flex h-0 flex-grow flex-col">
            {topDefectList?.length === 0 ? (
              <div className="flex w-full justify-center">
                <p className="text-xs">
                  {isLoadingTopDefects ? "กำลังโหลดข้อมูล / Loading data" : "ไม่พบข้อมูล / No data found"}
                </p>
              </div>
            ) : (
              <HorizontalBarChart
                data={[
                  ...topDefectList?.map(({ case_name, ng_quantity }) => ({
                    label: case_name,
                    value: ng_quantity,
                  })),
                ]}
              />
            )}
          </div>
        </div>
        {/*//! Summary Defects Chart */}
        <div className="flex h-[25rem] flex-col gap-2 rounded-md border p-2">
          <div className="flex flex-col gap-2 md:flex-row">
            <div className={cn("w-full")}>
              <h1 className="text-sm font-semibold">รายละเอียดของข้อมูลที่มีการบันทึก / Data Details</h1>
              <p className="text-xs text-muted-foreground">
                รายละเอียดของข้อมูลที่มีการบันทึกในระบบ / Details of data that have been recorded in the system
              </p>
            </div>
            <SelectForm
              value={shiftSelected}
              className="w-full md:w-[14rem] lg:w-[14rem]"
              onChange={(e) => setShiftSelected(e.target.value)}
              options={[
                {
                  label: "ทั้งหมด",
                  value: "ALL",
                },
                {
                  label: "กะเช้า / Day",
                  value: "DAY",
                },
                {
                  label: "กะดึก / Night",
                  value: "NIGHT",
                },
              ]}
            />
          </div>
          <div className="flex h-0 flex-grow flex-col">
            {isLoadingSummaryDefectsByDateGraph ? (
              <>
                <div className="flex h-full w-full justify-center">
                  <p className="text-xs">กำลังโหลดข้อมูล / Loading data...</p>
                </div>
              </>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
                <BarChart accessibilityLayer data={defectData(processSelected)}>
                  <CartesianGrid vertical={true} />

                  <YAxis />
                  <XAxis dataKey="time_slot" tickLine={true} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                  {processList?.map((process, i) => (
                    <Fragment key={i}>
                      {(processSelected === "ALL" || processSelected === process?.process_id) && (
                        <Bar
                          key={process?.process_name}
                          dataKey={process?.process_name}
                          fill={process?.process_color}
                          radius={1}
                          stackId="ng"
                        />
                      )}
                    </Fragment>
                  ))}
                </BarChart>
              </ChartContainer>
            )}
          </div>
        </div>
        {/*//! Summary Defects By Part Chart */}
        <div className="flex h-[25rem] flex-col gap-2 rounded-md border p-2">
          <div className="flex flex-col justify-between gap-2 md:flex-row lg:flex-row">
            <div className={cn("w-full")}>
              <h1 className="text-sm font-semibold">
                รายละเอียดของเสียแยกตามชิ้นงาน / Details of waste separated by work piece
              </h1>
              <p className="text-xs text-muted-foreground">
                รายการสาเหตุที่ทำให้งานของแต่ละ ชิ้นงาน ในกระบวนการ{" "}
                {processList?.find(({ process_id }) => process_id === processPartSelected)?.process_name} / List of
                reasons for the work of each piece in the process{" "}
                {processList?.find(({ process_id }) => process_id === processPartSelected)?.process_name}{" "}
              </p>
            </div>
            <SelectForm
              value={processPartSelected}
              className="w-full md:w-[14rem] lg:w-[14rem]"
              onChange={(e) => {
                refetchSummaryDefectsByPartGraph();
                setProcessPartSelected(e.target.value);
              }}
              options={processList?.map((process) => ({
                label: process?.process_name,
                value: process?.process_id,
              }))}
            />
          </div>
          <div className="flex h-0 flex-grow flex-col">
            {partSummaryList?.length === 0 ? (
              <div className="flex w-full justify-center">
                <p className="text-xs">
                  {isLoadingSummaryDefectsByPartGraph
                    ? "กำลังโหลดข้อมูล / Loading data"
                    : "ไม่พบข้อมูล / No data found"}
                </p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
                <BarChart
                  accessibilityLayer
                  data={partSummaryList?.map((item) => ({
                    label: item?.part_name,
                    ng_quantity: item?.ng_quantity ?? 0,
                  }))}
                >
                  <CartesianGrid vertical={true} />
                  <YAxis />
                  <XAxis dataKey="label" tickLine={true} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                  <Bar
                    dataKey={"ng_quantity"}
                    fill={processList?.find(({ process_id }) => process_id === processPartSelected)?.process_color}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </div>
        </div>
        {/*//! Summary Defects By Part Chart */}
        <div className="flex h-[25rem] flex-col gap-2 rounded-md border p-2">
          <div className="flex flex-col justify-between gap-2 md:flex-row lg:flex-row">
            <div className={cn("w-full")}>
              <h1 className="text-sm font-semibold">
                สาเหตุของงานเสียแยกตามชิ้นงาน / Causes of waste separated by work piece
              </h1>
              <p className="text-xs text-muted-foreground">
                รายการสาเหตุที่ทำให้งานเสียของแต่ละ ชิ้นงาน ในกระบวนการ{" "}
                {processList?.find(({ process_id }) => process_id === processPartSelected)?.process_name} / List of
                reasons for the work of each piece in the process{" "}
                {processList?.find(({ process_id }) => process_id === processPartSelected)?.process_name}{" "}
              </p>
            </div>
            <SelectForm
              className="w-full md:w-[14rem] lg:w-[14rem]"
              options={partSummaryList?.map((part) => ({
                label: part?.part_name,
                value: part?.part_name,
              }))}
              placeholder="เลือกชิ้นงาน / Select part"
              onChange={(e) => setPartSelected(e.target.value)}
              value={partSelected}
            />
          </div>
          <div className="flex h-0 flex-grow flex-col">
            {getPartSummaryList(partSummaryList, partSelected)?.length === 0 ? (
              <div className="flex w-full justify-center">
                <p className="text-xs">
                  {isLoadingSummaryDefectsByPartGraph
                    ? "กำลังโหลดข้อมูล / Loading data"
                    : partSelected
                      ? "เลือกชิ้นงานที่ต้องการดู / Select the part you want to see"
                      : "ไม่พบข้อมูล / No data found"}
                </p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
                <BarChart accessibilityLayer data={getPartSummaryList(partSummaryList, partSelected)}>
                  <CartesianGrid vertical={true} />
                  <YAxis />
                  <XAxis dataKey="label" tickLine={true} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                  <Bar
                    dataKey={"ng_quantity"}
                    fill={processList?.find(({ process_id }) => process_id === processPartSelected)?.process_color}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </div>
        </div>
        {/*//! Summary Defects By Part Chart */}
        <div className="flex h-[25rem] flex-col gap-2 rounded-md border p-2">
          <div className="flex flex-col justify-between gap-2 md:flex-row lg:flex-row">
            <div className={cn("w-full")}>
              <h1 className="text-sm font-semibold">
                ปริมาณการผลิตและความบกพร่องของผลิตภัณฑ์ / Production volume and product defects
              </h1>
              <p className="text-xs text-muted-foreground">
                รายการสาเหตุที่ทำให้งานเสียของแต่ละ ชิ้นงาน ในกระบวนการ{" "}
                {processList?.find(({ process_id }) => process_id === processPartSelected)?.process_name} / List of
                reasons for the work of each piece in the process{" "}
                {processList?.find(({ process_id }) => process_id === processPartSelected)?.process_name}{" "}
              </p>
            </div>
            <SelectForm
              className="w-full md:w-[14rem] lg:w-[14rem]"
              options={getPartSummaryList(partSummaryList, partSelected)?.map((part) => ({
                label: part?.label,
                value: part?.label,
              }))}
              placeholder="เลือกชิ้นงาน / Select part"
              onChange={(e) => setPartSelected(e.target.value)}
              value={partSelected}
            />
          </div>
          <div className="flex h-0 flex-grow flex-col">
            {getPartSummaryList(partSummaryList, partSelected)?.length === 0 ? (
              <div className="flex w-full justify-center">
                <p className="text-xs">
                  {isLoadingSummaryDefectsByPartGraph
                    ? "กำลังโหลดข้อมูล / Loading data"
                    : partSelected
                      ? "เลือกชิ้นงานที่ต้องการดู / Select the part you want to see"
                      : "ไม่พบข้อมูล / No data found"}
                </p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
                <BarChart accessibilityLayer data={getPartSummaryList(partSummaryList, partSelected)}>
                  <CartesianGrid vertical={true} />
                  <YAxis />
                  <XAxis dataKey="label" tickLine={true} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                  <Bar
                    dataKey={"ng_quantity"}
                    fill={processList?.find(({ process_id }) => process_id === processPartSelected)?.process_color}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
