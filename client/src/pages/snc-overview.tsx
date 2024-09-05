import { PageHeader } from "@/components/common/page-header";
import { Filtered } from "@/components/ui-pattern/filtered";
import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { groupByField } from "@/helpers/array.helper";
import { DEFECTION_TYPE_OPTIONS, MODE_OPTIONS } from "@/helpers/common.helper";
import { renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { useSNCOverview } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { FC, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

export const SNCOverview: FC = () => {
  const [filtered, setFiltered] = useState<{
    mode: "daily" | "period" | "week" | "monthly";
    defect_type: "ALL" | "P" | "S";
    start_date: string;
    end_date: string;
  }>({
    mode: "daily",
    defect_type: "ALL",
    start_date: renderFormattedPayloadDate(new Date()) ?? "",
    end_date: "",
  });

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

  const { useGetSncOverview } = useSNCOverview();
  const { sncOverviewList } = useAtomStore();

  const { isLoading: isSncOverviewLoading } = useGetSncOverview({
    start_date: filtered.start_date,
    end_date: filtered?.mode === "daily" ? filtered.start_date : filtered.end_date,
    defect_type: filtered.defect_type,
  });

  const groupedSncOverviewList = groupByField(sncOverviewList, "plant_code");
  const mapSncOverviewList = Object.keys(groupedSncOverviewList)?.map((key) => {
    return {
      plant_code: key,
      process: Object.keys(groupByField(groupedSncOverviewList[key], "process_id"))?.map((process) => {
        return {
          process_id: process,
          process_name: groupedSncOverviewList[key]?.find((item) => item.process_id === process)?.process_name,
          data: groupedSncOverviewList[key]?.filter((item) => item.process_id === process),
        };
      }),
    };
  });

  console.log("mapSncOverviewList", mapSncOverviewList);

  return (
    <div className="flex h-max flex-col gap-2 overflow-y-auto p-2">
      <div className="flex w-full items-center justify-between">
        <PageHeader title="SNC Overview" description="ภาพรวมของระบบ" />
        <Filtered
          modeOptions={MODE_OPTIONS}
          defectTypeOptions={DEFECTION_TYPE_OPTIONS}
          value={filtered}
          onChange={(value) => setFiltered(value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:col-span-2">
        {mapSncOverviewList?.map((item) => (
          <div key={item.plant_code} className="flex flex-col gap-2 rounded-md border p-2">
            <div className="flex w-full items-center justify-between">
              <div>
                <div className="text-xl font-semibold">{item?.plant_code}</div>
                <p className="text-sm">
                  รายงานข้อมูลของโรงงาน {item?.plant_code} ทั้งหมด {item?.process?.length} กระบวนการ
                </p>
              </div>
              <SelectForm
                options={item?.process?.map((process) => ({
                  label: process.process_name,
                  value: process.process_id,
                }))}
                className="w-full md:w-[10rem] lg:w-[10rem]"
              />
            </div>
            <div className="flex h-[25rem] flex-col gap-2 rounded-md p-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
