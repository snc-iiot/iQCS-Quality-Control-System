import { PageHeader } from "@/components/common/page-header";
import { Filtered } from "@/components/ui-pattern/filtered";
import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import ComposedChart from "@/components/ui/composed-chart";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { groupByField } from "@/helpers/array.helper";
import { DEFECTION_TYPE_OPTIONS, MODE_OPTIONS } from "@/helpers/common.helper";
import { renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { useSNCOverview } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TSNCOverview } from "@/types";
import { FileChartPie, Info } from "lucide-react";
import { FC, useEffect, useState } from "react";

// Define the types for the data structure
type SNCOverviewItem = TSNCOverview;

interface SNCOverviewProcess {
  process_id: string;
  process_name: string;
  data: SNCOverviewItem[];
}

interface SNCOverviewData {
  plant_code: string;
  process: SNCOverviewProcess[];
}

interface FilteredState {
  mode: "daily" | "period" | "week" | "monthly";
  defect_type: "ALL" | "P" | "S";
  start_date: string;
  end_date: string;
}

interface ProcessSelection {
  plant_code: string;
  process_id: string;
}

// Utility function with types
const groupSncOverviewList = (sncOverviewList: SNCOverviewItem[]): SNCOverviewData[] => {
  const grouped = groupByField(sncOverviewList, "plant_code");
  return Object.keys(grouped).map((plantCode) => ({
    plant_code: plantCode,
    process: Object.keys(groupByField(grouped[plantCode], "process_id")).map((processId) => ({
      process_id: processId,
      process_name: grouped[plantCode].find((item) => item.process_id === processId)?.process_name || "",
      data: grouped[plantCode].filter((item) => item.process_id === processId),
    })),
  }));
};

// Utility function for mapping composition data
const mapCompositionData = (
  mapSncOverviewList: SNCOverviewData[],
  plantCode: string,
  processSelected: ProcessSelection[],
  showPartId: boolean = false
): {
  label: string;
  part_id?: string;
  production: number;
  ng: number;
  percentage: number;
}[] => {
  const processId = processSelected.find((process) => process.plant_code === plantCode)?.process_id;
  const processData = mapSncOverviewList
    .find((item) => item.plant_code === plantCode)
    ?.process.find((item) => item.process_id === processId)?.data;

  const parsedNumber = (value: number) => (isNaN(Number(value)) ? 0 : value);

  if (showPartId) {
    return (
      processData?.map((item) => ({
        label: item.part_name,
        part_id: item.part_id,
        production: parsedNumber(item.production_quantity || 0),
        ng: parsedNumber(item.ng_quantity || 0),
        percentage: Number(parsedNumber(item.defects_percentage || 0)?.toFixed(2)),
      })) ?? []
    );
  }

  return (
    processData?.map((item) => ({
      label: item.part_name,
      production: parsedNumber(item.production_quantity || 0),
      ng: parsedNumber(item.ng_quantity || 0),
      percentage: Number(parsedNumber(item.defects_percentage || 0)?.toFixed(2)),
    })) ?? []
  );
};

export const SNCOverview: FC = () => {
  const [filtered, setFiltered] = useState<FilteredState>({
    mode: "monthly",
    defect_type: "ALL",
    start_date: renderFormattedPayloadDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)) ?? "",
    end_date: new Date().toISOString().split("T")[0],
  });
  const [plantSelected, setPlantSelected] = useState<string | null>(null);
  const [processSelected, setProcessSelected] = useState<ProcessSelection[]>([]);
  const [partSelected, setPartSelected] = useState<string | null>(null);
  const { useGetSncOverview, useGetSncPartDetail } = useSNCOverview();
  const { sncOverviewList, sncPartDetailList } = useAtomStore();

  const commonParams = {
    start_date: filtered.start_date,
    end_date: filtered.mode === "daily" ? filtered.start_date : filtered.end_date,
    defect_type: filtered.defect_type,
  };

  const { isLoading: isSncOverviewLoading } = useGetSncOverview(commonParams);
  useGetSncPartDetail({
    ...commonParams,
    part_id: partSelected ?? "",
    process_id: processSelected.find((process) => process.plant_code === plantSelected)?.process_id ?? "",
  });

  const mapSncOverviewList = groupSncOverviewList(sncOverviewList);

  console.log(mapSncOverviewList);

  useEffect(() => {
    if (mapSncOverviewList.length > 0) {
      setProcessSelected((prev) =>
        prev.filter((process) => mapSncOverviewList.find((item) => item.plant_code === process.plant_code))
      );
    }
  }, [mapSncOverviewList.length, filtered]);

  if (isSncOverviewLoading) {
    return (
      <div className="flex h-[25rem] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col space-y-2 overflow-y-auto p-2">
      <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row lg:flex-row">
        <PageHeader title="SNC Overview" description="ภาพรวมของระบบ" />
        <Filtered
          modeOptions={MODE_OPTIONS}
          defectTypeOptions={DEFECTION_TYPE_OPTIONS}
          value={filtered}
          onChange={(value) => setFiltered(value)}
        />
      </div>
      {mapSncOverviewList?.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:col-span-2">
          {mapSncOverviewList?.map((item) => {
            return (
              <div key={item.plant_code} className="flex flex-col gap-2 rounded-md border p-2">
                <div className="flex w-full items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-base font-semibold capitalize">
                      {item.plant_code}
                      <TooltipProvider>
                        <Tooltip delayDuration={50}>
                          <TooltipTrigger asChild>
                            <Info
                              onClick={() => {
                                setPlantSelected(item.plant_code);
                                setPartSelected(null);
                                setProcessSelected((prev) => [
                                  ...prev.filter((process) => process.plant_code !== item.plant_code),
                                  { plant_code: item.plant_code, process_id: item.process[0].process_id },
                                ]);
                              }}
                              className="h-4 w-4 cursor-pointer text-gray-400"
                              strokeWidth={1.5}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="text-xs">คลิกเพื่อดูข้อมูลเพิ่มเติมเกี่ยวกับโรงงาน {item.plant_code}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-xs">
                      รายงานข้อมูลของโรงงาน {item.plant_code} ทั้งหมด {item.process.length} กระบวนการ
                    </p>
                    <div className="mt-2 flex w-max gap-2 rounded border border-dashed p-2 text-xs">
                      <div>
                        <div className="mr-1 inline-block h-2 w-2 rounded-full bg-[#102693]" />
                        <span className="text-xs">จำนวนชิ้นงานที่ผลิต</span>
                      </div>
                      <div>
                        <div className="mr-1 inline-block h-2 w-2 rounded-full bg-[#FF0000]" />
                        <span className="text-xs">จำนวนชิ้นงานที่เสีย</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <SelectForm
                      placeholder="กรุณาเลือกกระบวนการ"
                      options={item.process.map((process) => ({
                        label: process.process_name,
                        value: process.process_id,
                      }))}
                      className="w-full md:w-[10rem] lg:w-[10rem]"
                      value={processSelected.find((process) => process.plant_code === item.plant_code)?.process_id}
                      onChange={(e) =>
                        setProcessSelected((prev) => [
                          ...prev.filter((process) => process.plant_code !== item.plant_code),
                          { plant_code: item.plant_code, process_id: e.target.value },
                        ])
                      }
                    />
                  </div>
                </div>
                <div className="flex h-[25rem] flex-col gap-2 rounded-md p-2">
                  <ComposedChart
                    data={mapCompositionData(mapSncOverviewList, item?.plant_code, processSelected)}
                    Config={[
                      { key: "ng", color: "#FF0000" },
                      { key: "production", color: "#102693" },
                      { key: "percentage", color: "#000000", chart: "Line", yAxisId: "right", label: "%" },
                    ]}
                    enableLabelList={true}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-[25rem] flex-col items-center justify-center gap-2 text-sm">
          <FileChartPie className="h-10 w-10 text-gray-400" strokeWidth={1.5} />
          No data available for this period of time or defect type
        </div>
      )}
      <Sheet
        open={!!plantSelected}
        onOpenChange={() => {
          setPlantSelected(null);
          setPartSelected(null);
        }}
      >
        <SheetContent
          style={{
            maxWidth: "70vw",
            overflow: "hidden",
          }}
          className="flex flex-col gap-2"
        >
          <SheetHeader>
            <SheetTitle>
              {plantSelected} รายงานข้อมูลของโรงงาน {plantSelected}
            </SheetTitle>
            <SheetDescription>
              รายงานข้อมูลของโรงงาน {plantSelected} ทั้งหมด {mapSncOverviewList.length} กระบวนการ
            </SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col overflow-y-hidden">
            <div className="flex flex-grow-0 flex-col gap-2 overflow-y-auto">
              {mapSncOverviewList
                ?.filter((item) => item.plant_code === plantSelected)
                ?.map((item) => (
                  <div key={item.plant_code} className="flex flex-col gap-2 rounded-md border p-2">
                    <div className="flex w-full items-center justify-between">
                      <div>
                        <div className="mt-2 flex w-max gap-2 rounded border border-dashed p-2 text-xs">
                          <div>
                            <div className="mr-1 inline-block h-2 w-2 rounded-full bg-[#102693]" />
                            <span className="text-xs">จำนวนชิ้นงานที่ผลิต</span>
                          </div>
                          <div>
                            <div className="mr-1 inline-block h-2 w-2 rounded-full bg-[#FF0000]" />
                            <span className="text-xs">จำนวนชิ้นงานที่เสีย</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <SelectForm
                          placeholder="กรุณาเลือกกระบวนการ"
                          options={item.process.map((process) => ({
                            label: process.process_name,
                            value: process.process_id,
                          }))}
                          className="w-full md:w-[10rem] lg:w-[10rem]"
                          value={processSelected.find((process) => process.plant_code === item.plant_code)?.process_id}
                          onChange={(e) => {
                            setProcessSelected((prev) => [
                              ...prev.filter((process) => process.plant_code !== item.plant_code),
                              { plant_code: item.plant_code, process_id: e.target.value },
                            ]);
                            setPartSelected(null);
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex h-[25rem] flex-col gap-2 rounded-md p-2">
                      <ComposedChart
                        data={mapCompositionData(mapSncOverviewList, item?.plant_code, processSelected)}
                        Config={[
                          { key: "ng", color: "#FF0000" },
                          { key: "production", color: "#102693" },
                          { key: "percentage", color: "#000000", chart: "Line", yAxisId: "right", label: "%" },
                        ]}
                        enableLabelList={true}
                      />
                    </div>
                  </div>
                ))}
              <div>
                {/* {isSncPartDetailLoading ? (
                  <div className="flex h-[25rem] items-center justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex h-[25rem] items-center justify-center rounded border text-sm">
                    No data available for this period of time or defect type
                  </div>
                )} */}
                <div className="flex h-[25rem] flex-col gap-2 rounded border p-2 text-sm">
                  <SelectForm
                    options={mapCompositionData(mapSncOverviewList, plantSelected ?? "", processSelected, true)?.map(
                      (item) => ({
                        label: item.label,
                        value: item.part_id ?? "",
                      })
                    )}
                    placeholder="กรุณาเลือกชิ้นงาน / Select part"
                    onChange={(e) => {
                      setPartSelected(e.target.value);
                    }}
                    value={partSelected ?? ""}
                  />
                  <ComposedChart
                    data={sncPartDetailList?.map((item) => ({
                      label: item.case_name,
                      ng: item.ng_quantity,
                    }))}
                    Config={[
                      { key: "ng", color: "#FF0000" },
                      { key: "production", color: "#102693" },
                    ]}
                    enableLabelList={true}
                    emptyLabel="No data available for this period of time or defect type"
                  />
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
