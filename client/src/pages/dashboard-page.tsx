import { PageHeader } from "@/components/common/page-header";
import { CardProcess } from "@/components/ui-pattern";
import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { HorizontalBarChart } from "@/components/ui/horizontal-bar-chart";
import { Input } from "@/components/ui/input";
import { groupByField } from "@/helpers/array.helper";
import { useDashboardHelper } from "@/helpers/dashboard.helper";
import { getStartDateEndDateOfWeek, getWeekString, renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { cn } from "@/lib/utils";
import { useDefect } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TGraphSummary } from "@/types";
import { FC, Fragment, useState } from "react";
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

  const [processSelected, setProcessSelected] = useState<string>("ALL");
  const [processPartSelected, setProcessPartSelected] = useState<string>(processList[0]?.process_id);
  const [ranking, setRanking] = useState<number>(10);

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
            ?.filter((item) => (process === "ALL" ? true : item?.process_name === process))
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

  const defectDataPartSummary = () => {
    const dataPartSummaryList = groupByField(partSummaryList, "part_code");

    const data = Object.keys(dataPartSummaryList)?.map((key) => {
      return {
        ...dataPartSummaryList[key]?.reduce(
          (acc, curr) => {
            return {
              ...acc,
              ng_quantity: (acc.ng_quantity || 0) + (curr.ng_quantity || 0),
            };
          },
          { label: key, ng_quantity: 0 }
        ),
      };
    });
    return data;
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

  const { isLoading: isLoadingSummaryDefectsByDateGraph } = useGetSummaryDefectsByDateGraph(
    selected?.start_date,
    selected?.type === "daily" ? selected?.start_date : selected?.end_date
  );
  const { isLoading: isLoadingTopDefects } = useGetTopDefects(
    selected?.start_date,
    selected?.type === "daily" ? selected?.start_date : selected?.end_date,
    processSelected,
    shiftSelected,
    ranking
  );
  const { isLoading: isLoadingSummaryDefectsByPartGraph } = useGetSummaryDefectsByPartGraph(
    selected?.start_date,
    selected?.type === "daily" ? selected?.start_date : selected?.end_date,
    processPartSelected
  );

  return (
    <div className="h-screen w-full overflow-auto" style={{ height: "calc(100vh - 4.4rem)" }}>
      <div className="flex h-full w-full flex-col gap-2 overflow-hidden px-2 py-1">
        <div className="flex h-min w-full flex-col items-center gap-1 md:flex-row">
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

        <div className="flex h-full flex-col space-y-2 md:h-full md:overflow-hidden">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-7">
            {mapCardProcess?.map((process) => (
              <CardProcess
                key={process?.process?.process_name}
                title={process?.process?.process_name}
                value={process?.ng}
                isActive={processSelected === process?.process?.process_name}
                onClick={() => {
                  if (processSelected === process?.process?.process_name) {
                    setProcessSelected("ALL");
                  }
                  if (processSelected !== process?.process?.process_name) {
                    setProcessSelected(process?.process?.process_name);
                  }
                }}
                color={process?.process?.process_color}
              />
            ))}
          </div>

          <div
            className="grid h-full w-full grid-cols-1 space-y-2 overflow-hidden rounded-md 
        md:grid-cols-1 md:gap-2 md:space-y-0 lg:grid-cols-3 lg:gap-2"
          >
            <div className="flex h-[10rem] w-full flex-col space-y-2 overflow-hidden rounded-md border p-2 shadow md:h-full">
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

              <div className="h-full">
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
                      ...Array(ranking - topDefectList?.length)
                        ?.fill(0)
                        ?.map(() => ({ label: "-", value: "1" })),
                    ]}
                  />
                )}
              </div>
            </div>

            <div className="col-span-2 flex h-full w-full flex-col gap-2 rounded-md border p-2 shadow">
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
              <div className="flex h-[14rem] w-full flex-col md:h-full lg:h-full">
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
                          {(processSelected === "ALL" || processSelected === process?.process_name) && (
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
          </div>
        </div>
      </div>

      <div className="grid h-full w-full flex-col gap-2 overflow-hidden px-2 py-1 md:grid-cols-2">
        <div className="flex w-full flex-col space-y-2 overflow-hidden rounded-md border p-2 shadow md:h-full">
          <div className=" justify-center md:flex">
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
              onChange={(e) => setProcessPartSelected(e.target.value)}
              options={processList?.map((process) => ({
                label: process?.process_name,
                value: process?.process_id,
              }))}
            />
          </div>
          {partSummaryList?.length === 0 ? (
            <div className="flex w-full justify-center">
              <p className="text-xs">
                {isLoadingSummaryDefectsByPartGraph ? "กำลังโหลดข้อมูล / Loading data" : "ไม่พบข้อมูล / No data found"}
              </p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
              <BarChart accessibilityLayer data={defectDataPartSummary()}>
                <CartesianGrid vertical={true} />
                <YAxis />
                <XAxis dataKey="label" tickLine={true} tickMargin={10} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey={"ng_quantity"} fill={"#8884d8"} />
              </BarChart>
            </ChartContainer>
          )}
        </div>
        <div className="flex w-full flex-col space-y-2 overflow-hidden rounded-md border p-2 shadow md:h-full"></div>
      </div>
    </div>
  );
};
