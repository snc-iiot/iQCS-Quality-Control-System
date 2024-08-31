import { PageHeader } from "@/components/common/page-header";
import { CardProcess } from "@/components/ui-pattern";
import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { useDashboardHelper } from "@/helpers/dashboard.helper";
import { getStartDateEndDateOfWeek, getWeekString, renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { cn } from "@/lib/utils";
import { useDefect } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TGraphSummary } from "@/types";
import { FC, Fragment, useState } from "react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const DashboardPage: FC = () => {
  const [selected, setSelected] = useState({
    type: "daily",
    start_date: renderFormattedPayloadDate(new Date()) ?? "",
    end_date: "",
  });

  const { useGetSummaryDefectsByDateGraph, useGetTopDefects } = useDefect();

  const { graphSummaryList, topDefectList, processList } = useAtomStore();
  const [shiftSelected, setShiftSelected] = useState<string>("ALL");
  const { groupProcess, groupDate } = useDashboardHelper(
    graphSummaryList
      ?.filter((item) => (shiftSelected == "ALL" ? true : item?.shift === shiftSelected))
      ?.map((info) => ({ ...info, date: info?.datetime.slice(0, 10) }))
  );

  const [processSelected, setProcessSelected] = useState<string>("ALL");

  const mapCardProcess = processList?.map((process) => {
    const data = groupProcess("process")[process?.process_name];
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
            ?.filter((item) => (process === "ALL" ? true : item?.process === process))
            ?.reduce(
              (acc, curr) => {
                return {
                  ...acc,
                  [curr?.process]: curr?.ng_quantity,
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
        const dataGroupProcess = groupProcess("process");

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

  // console.log("GET_TIME_SLOTS", GET_TIME_SLOTS(selectedDate));

  const { isLoading: isLoadingSummaryDefectsByDateGraph } = useGetSummaryDefectsByDateGraph(
    selected?.start_date,
    selected?.type === "daily" ? selected?.start_date : selected?.end_date
  );
  const { isLoading: isLoadingTopDefects } = useGetTopDefects(
    selected?.start_date,
    selected?.type === "daily" ? selected?.start_date : selected?.end_date,
    processSelected,
    shiftSelected
  );

  console.log("start_date", selected?.start_date);
  console.log("end_date", selected?.end_date);

  const data = [
    {
      case_name: "เป็นรอย",
      number_of_cases: 1000,
      color: "#800000",
    },
    {
      case_name: "หัก",
      number_of_cases: 900,
      color: "#990000",
    },
    {
      case_name: "ขาด",
      number_of_cases: 800,
      color: "#B20000",
    },
    {
      case_name: "หลุด",
      number_of_cases: 700,
      color: "#CB0000",
    },
    {
      case_name: "แตก",
      number_of_cases: 600,
      color: "#E40000",
    },
    {
      case_name: "เป็นรอย1",
      number_of_cases: 500,
      color: "#FD0000",
    },
    {
      case_name: "หัก1",
      number_of_cases: 400,
      color: "#FF2B00",
    },
    {
      case_name: "ขาด1",
      number_of_cases: 300,
      color: "#FF4400",
    },
    {
      case_name: "หลุด1",
      number_of_cases: 200,
      color: "#FF5500",
    },
    {
      case_name: "แตก1",
      number_of_cases: 100,
      color: "#FF7F50",
    },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-auto p-2 md:overflow-hidden">
      <div className="flex h-min w-full flex-col items-center gap-1 md:flex-row">
        <PageHeader title="ภาพรวม / Dashboard" description="ภาพรวมของระบบ" />

        <div className="flex w-full flex-col gap-2 md:w-min md:flex-row">
          {/* <ul className="flex w-full items-center gap-2 rounded-sm bg-slate-100 p-1 px-2 text-center text-sm font-medium text-gray-500 md:w-min">
            {["Daily", "Period"]?.map((item, i) => (
              <li
                key={i}
                className="w-full cursor-pointer md:w-min"
                onClick={() => {
                  setSelected({
                    ...selected,
                    type: item?.toLocaleLowerCase(),
                    end_date: item === "Period" ? selected?.start_date : "",
                  });
                }}
              >
                <p
                  className={`active inline-block w-full rounded-sm ${
                    selected?.type === item?.toLocaleLowerCase() ? "bg-green-600" : ""
                  } ${
                    selected?.type === item?.toLocaleLowerCase()
                      ? ""
                      : "bg-white !text-gray-900 hover:bg-gray-200 hover:text-gray-900"
                  } p-1 text-white md:w-20`}
                  aria-current="page"
                >
                  {item}
                </p>
              </li>
            ))}
          </ul> */}
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

      <div className="flex h-max flex-col space-y-2 md:h-full md:overflow-hidden">
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
          <div className="flex h-[20rem] w-full flex-col space-y-2 overflow-auto rounded-md border p-2 shadow md:h-full">
            <div className={cn("w-full")}>
              <h1 className="text-sm font-semibold">
                10 สาเหตุที่ทำให้งานเสียมากที่สุด / Top 10 causes that cause the most defects
              </h1>
              <p className="text-xs text-muted-foreground">
                รายการสาเหตุที่ทำให้งานเสียมากที่สุดในวันที่ {selected?.start_date} / Top 10 causes that cause the most
                defects on {selected?.start_date}
              </p>
            </div>
            {!isLoadingTopDefects ? (
              <div className="flex w-full flex-1 flex-col overflow-auto pr-2">
                <div>
                  {topDefectList?.length === 0 && (
                    <div className="flex w-full justify-center">
                      <p className="text-xs">ไม่พบข้อมูล / No data found</p>
                    </div>
                  )}
                  {topDefectList?.map((defect, index) => (
                    <div
                      key={`top-defect-detail-${index}`}
                      className={cn(
                        "grid w-full grid-cols-2 p-1",
                        "border-b border-gray-100",
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      )}
                    >
                      <div className="flex flex-col">
                        <p className="text-xs font-medium">{defect?.case_name}</p>
                      </div>
                      <div className="flex w-full justify-end">
                        <p className="text-xs">{defect?.ng_quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full w-full justify-center">
                <p className="text-xs">กำลังโหลดข้อมูล / Loading data...</p>
              </div>
            )}
            <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
              <ComposedChart
                layout="vertical"
                accessibilityLayer
                data={data}
                margin={{
                  top: 20,
                  right: 10,
                  bottom: 20,
                  left: -10,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis type="number" className="text-[10px]" />
                <YAxis dataKey="case_name" type="category" scale="band" className="text-xs" />
                <Tooltip />
                <Bar dataKey="number_of_cases" name={"Number of cases"} barSize={20}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </ComposedChart>
            </ChartContainer>
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
  );
};
