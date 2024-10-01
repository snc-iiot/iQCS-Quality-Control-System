import { PageHeader } from "@/components/common/page-header";
import LineBarComposedChart from "@/components/dashboard/line-bar-composed-chart";
import PieChart from "@/components/dashboard/pie-chart";
import { CardProcess } from "@/components/ui-pattern";
import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import { AutoComplete } from "@/components/ui/autocomplete";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { HorizontalBarChart } from "@/components/ui/horizontal-bar-chart";
import { Input } from "@/components/ui/input";
import { filterDuplicates, groupByField } from "@/helpers/array.helper";
import { useDashboardHelper } from "@/helpers/dashboard.helper";
import {
  getStartDateEndDateOfWeek,
  getWeekString,
  optionsYearly,
  renderFormattedPayloadDate,
} from "@/helpers/date-time.helper";
import { cn } from "@/lib/utils";
import { useDefect } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TDefectsTypeReq, TGraphSummary, TPartSummary, TPartSummaryDetails } from "@/types";
import { FC, Fragment, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export const DashboardPage: FC = () => {
  const [selected, setSelected] = useState({
    type: "daily",
    start_date: renderFormattedPayloadDate(new Date()) ?? "",
    end_date: "",
  });

  const {
    useGetSummaryDefectsByDateGraph,
    useGetTopDefects,
    useGetSummaryDefectsByPartGraph,
    useGetSummaryDefectsByModelGraph,
  } = useDefect();
  const { graphSummaryList, topDefectList, processList, partSummaryList, modelSummaryList } = useAtomStore();
  const [shiftSelected, setShiftSelected] = useState<string>("ALL");
  const { groupProcess, groupDate } = useDashboardHelper(
    graphSummaryList
      ?.filter((item) => (shiftSelected == "ALL" ? true : item?.shift === shiftSelected))
      ?.map((info) => ({ ...info, date: info?.datetime.slice(0, 10) }))
  );

  const [processSelected, setProcessSelected] = useState<string>("ALL");
  const [processPartSelected, setProcessPartSelected] = useState<{ process: string; length: number }>({
    process: "",
    length: 9999999,
  });
  const [ngTypeSelected, setNgTypeSelected] = useState<TDefectsTypeReq>("ALL");
  const [ranking, setRanking] = useState<number>(10);
  // const [partSelected, setPartSelected] = useState<string>("");
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
    selected?.type === "daily" ? selected?.start_date : selected?.end_date,
    ngTypeSelected
  );

  const { isFetching: isLoadingTopDefects } = useGetTopDefects(
    selected?.start_date,
    selected?.type === "daily" ? selected?.start_date : selected?.end_date,
    processSelected,
    shiftSelected,
    ranking,
    ngTypeSelected
  );

  const { isFetching: isLoadingSummaryDefectsByPartGraph, refetch: refetchSummaryDefectsByPartGraph } =
    useGetSummaryDefectsByPartGraph(
      selected?.start_date,
      selected?.type === "daily" ? selected?.start_date : selected?.end_date,
      processPartSelected?.process === "" ? "ALL" : processPartSelected?.process,
      ngTypeSelected
    );

  const { isFetching: isLoadingSummaryDefectsByModelGraph, refetch: refetchSummaryDefectsByModelGraph } =
    useGetSummaryDefectsByModelGraph(
      selected?.start_date,
      selected?.type === "daily" ? selected?.start_date : selected?.end_date,
      ngTypeSelected
    );

  const getPartSummaryList = (partSummaryList: TPartSummary[]) => {
    const dataPartName = groupByField(partSummaryList, "part_name");

    return Object.keys(dataPartName).map((label) => {
      const ng_quantity = isNaN(dataPartName[label].reduce((sum, item) => sum + (item.ng_quantity || 0), 0))
        ? 0
        : dataPartName[label].reduce((sum, item) => sum + (item.ng_quantity || 0), 0);

      const production_quantity = isNaN(
        dataPartName[label].reduce((sum, item) => sum + (item.production_quantity || 0), 0)
      )
        ? 0
        : dataPartName[label].reduce((sum, item) => sum + (item.production_quantity || 0), 0);

      const dataDetails = groupByField(
        dataPartName[label].reduce<TPartSummaryDetails[]>((sum, item) => sum.concat(item?.details ?? []), []),
        "case_name"
      );

      const details = Object.keys(dataDetails)?.map((case_name) => ({
        case_name,
        ng_quantity: dataDetails[case_name].reduce((sum, item) => sum + item.ng_quantity, 0),
      }));

      const defect = Math.ceil((ng_quantity / production_quantity) * 100);

      return {
        label,
        ng_quantity: isNaN(ng_quantity) ? 0 : ng_quantity,
        production_quantity: isNaN(production_quantity) ? 0 : production_quantity,
        defect: defect === Infinity ? null : defect,
        details,
      };
    });
  };

  // useEffect(() => {
  //   setProcessPartSelected({
  //     ...processPartSelected,
  //     process: graphSummaryList?.find((info) => info?.ng_quantity > 0)?.process_id ?? "",
  //   });
  // }, [isLoadingSummaryDefectsByDateGraph === false]);

  useEffect(() => {
    setPartSelected(partSummaryList[0]?.part_name ?? "");
  }, [isLoadingSummaryDefectsByPartGraph === false]);

  return (
    <div className="relative flex h-full w-full flex-col space-y-2 overflow-y-auto ">
      <div className="top-0 z-10 mb-[-7px] flex h-max w-full flex-col justify-between gap-2 bg-white p-2 md:flex-row lg:sticky lg:flex-row">
        <PageHeader title="ภาพรวม / Dashboard" description="ภาพรวมของระบบ" />
        <div className="flex w-full flex-col gap-2 md:w-min md:flex-row lg:w-min">
          <SelectForm
            options={[
              {
                label: "Part + Shop (All)",
                value: "ALL",
              },
              {
                label: "Part (Incoming)",
                value: "P",
              },
              {
                label: "Shop (Inprocess)",
                value: "S",
              },
            ]}
            value={ngTypeSelected}
            onChange={(e) => setNgTypeSelected(e.target.value as "ALL" | "P" | "S")}
            className="w-full md:w-[10rem] lg:w-[10rem]"
          />
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
              } else if (value == "yearly") {
                setSelected({
                  ...selected,
                  type: e.target.value,
                  start_date: `${new Date()?.getFullYear()}-01-01`,
                  end_date: `${new Date()?.getFullYear()}-12-31`,
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
              {
                label: "รายปี / Yearly",
                value: "yearly",
              },
            ]}
            className="w-full md:w-[10rem] lg:w-[10rem]"
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
          {selected?.type === "yearly" && (
            <SelectForm
              options={optionsYearly()}
              className="w-[10rem]"
              value={selected?.start_date?.slice(0, 4)}
              onChange={(e) => {
                setSelected((prev) => ({
                  ...prev,
                  start_date: `${e.target.value}-01-01`,
                  end_date: `${e.target.value}-12-31`,
                }));
              }}
            />
          )}
        </div>
      </div>

      <div className="grid h-max grid-cols-1 gap-2 px-2 md:grid-cols-3 lg:grid-cols-3">
        <PieChart
          title={`ยอดเปรียบเทียบของโมเดล / Comparison of models`}
          description="แสดงยอดเปรียบเทียบของโมเดล / Show comparison of models"
          data={modelSummaryList
            ?.sort((a, b) => Number(b?.ng_quantity) - Number(a?.ng_quantity))
            ?.map(({ model_name, ng_quantity, production_quantity, defect_percentage }) => ({
              label: model_name ?? "ไม่มีโมเดล",
              production_quantity: Number(production_quantity),
              ng_quantity: Number(ng_quantity),
              defect: Number(defect_percentage),
            }))}
          isLoading={isLoadingSummaryDefectsByModelGraph}
          isMode
        />
        <div className=" col-span-2">
          <LineBarComposedChart
            title={`ยอดการผลิตและยอดงานเสียของแต่ละโมเดล / Total production and total lost work of each model `}
            description="แสดงยอดการผลิตและงานเสียของแต่ละโมเดล / Displays total production and lost work for each model."
            data={modelSummaryList
              ?.sort((a, b) => Number(b?.ng_quantity) - Number(a?.ng_quantity))
              ?.map(({ model_name, ng_quantity, production_quantity, defect_percentage }) => ({
                label: model_name ?? "ไม่มีโมเดล",
                production_quantity: Number(production_quantity),
                ng_quantity: Number(ng_quantity),
                defect: Number(defect_percentage),
              }))}
            isLoading={isLoadingSummaryDefectsByModelGraph}
            isMode
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-2 md:grid-cols-2 lg:grid-cols-7">
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
      <div className="grid h-max grid-cols-1 gap-2 px-2 md:grid-cols-2 lg:grid-cols-2">
        {/*//! Top Rank Chart  */}
        <div className="flex h-[25rem] flex-col gap-2 rounded-md border p-2">
          <div className="flex">
            <div className={cn("w-full")}>
              <h1 className="text-sm font-semibold">
                {ranking} อาการที่ทำให้งานเสียมากที่สุด / Top {ranking} symptoms that symptom the most defects
              </h1>
              <p className="text-xs text-muted-foreground">
                รายการอาการที่ทำให้งานเสียมากที่สุด / List of symptoms that symptom the most work loss
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
                    value: isNaN(ng_quantity) ? 0 : ng_quantity,
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
              className="w-full md:w-[8rem] lg:w-[8rem]"
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
              // production_quantity
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
                รายการอาการที่ทำให้งานของแต่ละ ชิ้นงาน ในกระบวนการ{" "}
                {processList?.find(({ process_id }) => process_id === processPartSelected?.process)?.process_name ??
                  "กระบวนการทั้งหมด"}{" "}
                / List of reasons for the work of each piece in the process{" "}
                {processList?.find(({ process_id }) => process_id === processPartSelected?.process)?.process_name ??
                  "All process"}{" "}
              </p>
            </div>
            <SelectForm
              value={processPartSelected?.process}
              className="w-full md:w-[8rem]"
              onChange={(e) => {
                refetchSummaryDefectsByPartGraph();
                refetchSummaryDefectsByModelGraph();
                setProcessPartSelected({ ...processPartSelected, process: e.target.value });
              }}
              placeholder="All process"
              options={processList?.map((process) => ({
                label: process?.process_name,
                value: process?.process_id,
              }))}
            />
            <SelectForm
              value={String(processPartSelected?.length)}
              className="w-full md:w-[6rem]"
              onChange={(e) => {
                refetchSummaryDefectsByPartGraph();
                refetchSummaryDefectsByModelGraph();
                setProcessPartSelected({ ...processPartSelected, length: Number(e.target.value) });
              }}
              options={["9999999", "5", "10", "15", "20"]?.map((num) => ({
                label: num === "9999999" ? "All length" : num,
                value: num,
              }))}
            />
          </div>
          <div className="flex h-0 flex-grow flex-col">
            {getPartSummaryList(partSummaryList)?.length === 0 ? (
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
                  data={getPartSummaryList(partSummaryList)
                    ?.sort((a, b) => b?.ng_quantity - a?.ng_quantity)
                    ?.slice(0, Number(processPartSelected?.length))}
                >
                  <CartesianGrid vertical={true} />
                  <YAxis />
                  <XAxis dataKey="label" tickLine={true} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                  <Bar
                    dataKey={"ng_quantity"}
                    fill={
                      processList?.find(({ process_id }) => process_id === processPartSelected?.process)
                        ?.process_color || "#FF2020"
                    }
                    className=" cursor-pointer"
                    onClick={(e) => setPartSelected(e?.label)}
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
                อาการของงานเสียแยกตามชิ้นงาน / Symptoms of waste separated by work piece
              </h1>
              <p className="text-xs text-muted-foreground">
                รายการอาการที่ทำให้งานเสียของแต่ละ ชิ้นงาน ในกระบวนการ{" "}
                {processList?.find(({ process_id }) => process_id === processPartSelected?.process)?.process_name} /
                List of reasons for the work of each piece in the process{" "}
                {processList?.find(({ process_id }) => process_id === processPartSelected?.process)?.process_name}{" "}
              </p>
            </div>
            <AutoComplete
              options={filterDuplicates(partSummaryList, "part_name")?.map((part) => part?.part_name)}
              value={partSelected}
              onChange={(value) => setPartSelected(value)}
              className="w-full md:w-[14rem] lg:w-[14rem]"
              placeholder="ชิ้นงาน / Part"
            />
          </div>
          <div className="flex h-0 flex-grow flex-col">
            {(getPartSummaryList(partSummaryList)?.find(({ label }) => label === partSelected)?.details?.length ??
              0) === 0 ? (
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
                <BarChart
                  accessibilityLayer
                  data={getPartSummaryList(partSummaryList)?.find(({ label }) => label === partSelected)?.details}
                >
                  <CartesianGrid vertical={true} />
                  <YAxis />
                  <XAxis dataKey="case_name" tickLine={true} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                  <Bar
                    dataKey={"ng_quantity"}
                    fill={
                      processList?.find(({ process_id }) => process_id === processPartSelected?.process)
                        ?.process_color || "#FF2020"
                    }
                  />
                </BarChart>
              </ChartContainer>
            )}
          </div>
        </div>
        <LineBarComposedChart
          title={`การผลิตเทียบกับงานเสีย ${
            processPartSelected?.length === 9999999 ? "ทั้งหมด" : `ท็อป ${processPartSelected?.length}`
          } เรียงตามความแตกต่าง / Production compared to waste ${
            processPartSelected?.length === 9999999 ? "all" : `top ${processPartSelected?.length}`
          } sort by difference`}
          description="การผลิตเทียบกับจำนวนงานที่มีข้อบกพร่อง จัดเรียงตามความแตกต่าง / Production compared to the number of defective jobs Sort by difference"
          data={getPartSummaryList(partSummaryList)
            ?.sort((a, b) => Number(b?.defect ?? 0) - Number(a?.defect ?? 0))
            ?.slice(0, Number(processPartSelected?.length))
            ?.map(({ label, ng_quantity, production_quantity, defect }) => ({
              label,
              production_quantity,
              ng_quantity,
              defect,
            }))}
          isLoading={isLoadingSummaryDefectsByPartGraph}
          isMode
        />
        <LineBarComposedChart
          title={`การผลิตเทียบกับงานเสีย ${
            processPartSelected?.length === 9999999 ? "ทั้งหมด" : `ท็อป ${processPartSelected?.length}`
          } เรียงตามงานเสีย / Production compared to waste ${
            processPartSelected?.length === 9999999 ? "all" : `top ${processPartSelected?.length} defective items`
          } sort by broken work`}
          description="การผลิตเทียบกับจำนวนงานที่มีข้อบกพร่อง จัดเรียงตามข้อบกพร่องส่วนใหญ่ / Production compared to the number of defective jobs Sort by most faults"
          data={getPartSummaryList(partSummaryList)
            ?.sort((a, b) => b?.ng_quantity - a?.ng_quantity)
            ?.slice(0, Number(processPartSelected?.length))
            ?.map(({ label, ng_quantity, production_quantity, defect }) => ({
              label,
              production_quantity,
              ng_quantity,
              defect,
            }))}
          isLoading={isLoadingSummaryDefectsByPartGraph}
          isMode
        />
      </div>
    </div>
  );
};
