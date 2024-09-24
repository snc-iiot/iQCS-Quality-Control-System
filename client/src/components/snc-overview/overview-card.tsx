import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import ComposedChart from "@/components/ui/composed-chart";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { mapCompositionData } from "@/helpers/dashboard.helper";
import { ProcessSelection, SNCOverviewData, SNCOverviewItem } from "@/types"; // Adjust the import path as needed
import React, { FC, useEffect, useState } from "react";

interface OverviewCardProps {
  plantCode: string;
  processes: {
    process_id: string;
    process_name: string;
    data: SNCOverviewItem[];
  }[];
  processSelected: ProcessSelection[];
  setPlantSelected: React.Dispatch<React.SetStateAction<string | null>>;
  setProcessSelected: React.Dispatch<React.SetStateAction<ProcessSelection[]>>;
  setPartSelected: React.Dispatch<React.SetStateAction<string | null>>;
  mapSncOverviewList: SNCOverviewData[];
}

export const OverviewCard: FC<OverviewCardProps> = ({
  plantCode,
  processes,
  processSelected,
  setPlantSelected,
  setProcessSelected,
  setPartSelected,
  mapSncOverviewList,
}) => {
  const [mode, setMode] = useState("");
  const [sort, setSort] = useState<"ng" | "percentage">("ng");
  const [length, setLength] = useState("");

  const handleInfoClick = () => {
    setPlantSelected(plantCode);
    setPartSelected(null);
    setProcessSelected((prev) => [
      ...prev.filter((process) => process.plant_code !== plantCode),
      { plant_code: plantCode, process_id: processes[0].process_id },
    ]);
  };

  const handleProcessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProcessSelected((prev) => [
      ...prev.filter((process) => process.plant_code !== plantCode),
      { plant_code: plantCode, process_id: e.target.value },
    ]);
  };

  //default process first process
  useEffect(() => {
    if (processes.length > 0) {
      setProcessSelected((prev) => [
        ...prev.filter((process) => process.plant_code !== plantCode),
        { plant_code: plantCode, process_id: "" },
      ]);
    }
  }, [processes]);

  const totalProduction = (
    processes: { process_id: string; process_name: string; data: SNCOverviewItem[] }[]
  ): {
    production: number;
    ng: number;
  } => {
    let totalProduction = 0;
    let totalNg = 0;
    processes.forEach((process) => {
      process.data.forEach((data) => {
        totalProduction += data.production_quantity || 0;
        totalNg += data?.ng_quantity;
      });
    });
    return { production: totalProduction, ng: totalNg };
  };

  return (
    <div className="flex flex-col gap-2 rounded-md border p-2">
      <div>
        <div className="flex items-center justify-between gap-2 text-base font-semibold capitalize">
          <h3>{plantCode}</h3>
          <TooltipProvider>
            <Tooltip delayDuration={50}>
              <TooltipTrigger className="text-xs text-blue-500" onClick={handleInfoClick}>
                {/* <Info onClick={handleInfoClick} className="h-4 w-4 cursor-pointer text-gray-400" strokeWidth={1.5} /> */}
                คลิกเพื่อดูข้อมูลเพิ่มเติม
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">คลิกเพื่อดูข้อมูลเพิ่มเติมเกี่ยวกับโรงงาน {plantCode}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-xs">
          รายงานข้อมูลของโรงงาน {plantCode} ทั้งหมด {processes.length} กระบวนการ
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
      <div className="space-y-1">
        <h3 className="text-xs font-semibold">รายงานยอดงานเสียแยกตามกระบวนการ</h3>
        <div className="grid h-max grid-cols-2 gap-2 md:grid-cols-5 lg:grid-cols-5">
          {processes?.map((process) => (
            <div key={process.process_id} className="flex flex-col rounded-md border p-2">
              <h4 className="text-xs font-semibold capitalize">{process.process_name}</h4>
              <div className="flex items-center gap-2">
                <div className="mr-1 inline-block h-2 w-2 rounded-full bg-[#102693]" />
                <span className="text-xs">{totalProduction([process]).production?.toLocaleString()} ชิ้นงาน</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="mr-1 inline-block h-2 w-2 rounded-full bg-[#FF0000]" />
                <span className="text-xs">{totalProduction([process]).ng?.toLocaleString()} ชิ้นงาน</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <h4 className="text-xs font-medium">กราฟแสดงข้อมูลการผลิตและการเสียนกระบวนการที่เลือก</h4>
        <div className="flex items-center gap-2">
          <SelectForm
            options={processes?.map((process) => ({
              label: process?.process_name,
              value: process?.process_id,
            }))}
            className="w-full md:w-[8rem] lg:w-[8rem]"
            value={processSelected.find((process) => process.plant_code === plantCode)?.process_id || ""}
            onChange={handleProcessChange}
          />
          <SelectForm
            placeholder="Default"
            options={[
              {
                label: "Sort by ng work",
                value: "ng",
              },
              {
                label: "Sort by percentage",
                value: "percentage",
              },
            ]}
            defaultValue={"ng"}
            className="w-full md:w-[8rem] lg:w-[8rem]"
            value={sort}
            onChange={(e) => setSort(e?.target?.value as "ng" | "percentage")}
          />

          <SelectForm
            placeholder="All length"
            options={[
              {
                label: "5",
                value: "5",
              },
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
            className="w-full md:w-[7rem] lg:w-[7rem]"
            value={length}
            onChange={(e) => setLength(e?.target?.value)}
          />

          <SelectForm
            placeholder="Default"
            options={[
              {
                label: "PPM",
                value: "ppm",
              },
            ]}
            className="w-full md:w-[6rem] lg:w-[6rem]"
            value={mode}
            onChange={(e) => setMode(e?.target?.value)}
          />
        </div>
      </div>
      <div className="flex h-[20rem] flex-col gap-2 rounded-md p-2">
        <ComposedChart
          data={mapCompositionData(mapSncOverviewList, plantCode, processSelected)?.map((info) => ({
            ...info,
            percentage: info?.percentage * (mode === "ppm" ? 10000 : 1),
          }))}
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
};
