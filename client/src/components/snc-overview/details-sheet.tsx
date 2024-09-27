import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import ComposedChart from "@/components/ui/composed-chart";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mapCompositionData } from "@/helpers/dashboard.helper";
import { ProcessSelection, SNCOverviewData, TSNCPartDetail } from "@/types";
import { ChangeEvent, FC, ReactNode, useEffect, useState } from "react";

interface DetailsSheetProps {
  plantSelected: string | null;
  setPlantSelected: React.Dispatch<React.SetStateAction<string | null>>;
  mapSncOverviewList: SNCOverviewData[];
  processSelected: ProcessSelection[];
  setProcessSelected: React.Dispatch<React.SetStateAction<ProcessSelection[]>>;
  partSelected: string | null;
  setPartSelected: React.Dispatch<React.SetStateAction<string | null>>;
  sncPartDetailList: TSNCPartDetail[]; // Adjust the type based on your data
  filtered?: JSX.Element | ReactNode;
  defaultValue?: {
    mode?: string;
    sort?: "ng" | "percentage";
    length?: string;
  };
}

export const DetailsSheet: FC<DetailsSheetProps> = ({
  plantSelected,
  setPlantSelected,
  mapSncOverviewList,
  processSelected,
  setProcessSelected,
  partSelected,
  setPartSelected,
  sncPartDetailList,
  filtered,
  defaultValue,
}) => {
  const [mode, setMode] = useState(defaultValue?.mode ?? "");
  const [sort, setSort] = useState<"ng" | "percentage">(defaultValue?.sort ?? "ng");
  const [length, setLength] = useState(defaultValue?.length ?? "");

  console.log(sncPartDetailList);

  const selectedPlantData = mapSncOverviewList?.find((item) => item.plant_code === plantSelected);
  const handleProcessChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedProcess = processSelected.find((p) => p.plant_code === plantSelected);
    const newProcessSelected = processSelected.filter((p) => p.plant_code !== plantSelected);
    setPartSelected(null);
    if (selectedProcess) {
      setProcessSelected([...newProcessSelected, { plant_code: plantSelected ?? "", process_id: e.target.value }]);
    }
  };

  const partOptions = mapCompositionData(mapSncOverviewList, plantSelected ?? "", processSelected, true)?.map(
    (item) => ({
      label: item.label,
      value: item.part_id ?? "",
    })
  );

  console.log(
    mapSncOverviewList
      ?.find(({ plant_code }) => plant_code === plantSelected)
      ?.process?.filter(({ process_id }) => process_id !== "")
      ?.flatMap(({ process_id, process_name, data }) => {
        const dataPart = data?.map((info) => ({
          ...info,
          process_id,
          process_name,
        }));
        return dataPart;
      })
  );

  //default setPartSelected first part
  useEffect(() => {
    if (partOptions?.length && !partSelected) {
      setPartSelected(partOptions[0].value);
    }
  }, [partOptions]);

  if (!selectedPlantData) return null;

  return (
    <Sheet
      open={!!plantSelected}
      onOpenChange={() => {
        setPlantSelected(null);
        setPartSelected(null);
      }}
    >
      <SheetContent
        style={{
          maxWidth: "80vw",
          overflow: "hidden",
        }}
        className="flex flex-col gap-2"
      >
        <SheetHeader className="flex flex-row justify-between">
          <div>
            <SheetTitle>รายงานข้อมูลของโรงงาน {plantSelected}</SheetTitle>
            <SheetDescription>
              รายงานข้อมูลของโรงงาน {plantSelected} ทั้งหมด {selectedPlantData?.process?.length} กระบวนการ
            </SheetDescription>
            {filtered}
          </div>

          <div className=" flex gap-2 pr-4">
            <SelectForm
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
              className="w-full md:w-[9rem] lg:w-[9rem]"
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
        </SheetHeader>
        <div className="flex h-full w-full flex-col overflow-y-hidden">
          <div className="flex flex-grow-0 flex-col gap-2 overflow-y-auto">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2">
              {selectedPlantData?.process?.map((process) => (
                <div key={process.process_id} className="flex flex-col gap-2 rounded-md border p-2">
                  <div className="flex w-full items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold">{process.process_name}</p>
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
                  </div>
                  <div className="flex h-[20rem] flex-col gap-2 rounded-md p-2">
                    <ComposedChart
                      data={process.data
                        ?.map((item) => ({
                          label: item.part_name,
                          production: item.production_quantity,
                          ng: item.ng_quantity,
                          percentage: Number((item.defects_percentage * (mode === "ppm" ? 10000 : 1))?.toFixed(2) ?? 0),
                        }))
                        ?.sort((x, y) => (x?.[sort] < y?.[sort] ? 1 : -1))
                        ?.slice(0, Number(length === "" ? process.data?.length : length))}
                      Config={[
                        { key: "ng", color: "#FF0000" },
                        { key: "production", color: "#102693" },
                        {
                          key: "percentage",
                          color: "#000000",
                          chart: "Line",
                          yAxisId: "right",
                          label: mode === "ppm" ? "PPM" : "%",
                        },
                      ]}
                      enableLabelList={true}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="flex h-[20rem] flex-col gap-2 rounded border p-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">รายงานข้อมูลชิ้นงาน</h3>
                    <p className="text-xs">กรุณาเลือกชิ้นงานที่ต้องการดูข้อมูล</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SelectForm
                      options={selectedPlantData?.process
                        ?.filter(({ process_id }) => process_id !== "")
                        .map((proc) => ({
                          label: proc.process_name,
                          value: proc.process_id,
                        }))}
                      value={processSelected.find((p) => p.plant_code === plantSelected)?.process_id || ""}
                      placeholder="กรุณาเลือกกระบวนการ"
                      className="w-full md:w-[10rem] lg:w-[10rem]"
                      onChange={handleProcessChange}
                    />

                    <SelectForm
                      options={partOptions}
                      placeholder="กรุณาเลือกชิ้นงาน / Select part"
                      onChange={(e) => {
                        setPartSelected(e.target.value);
                      }}
                      value={partSelected ?? ""}
                    />
                  </div>
                </div>
                <ComposedChart
                  data={sncPartDetailList?.map((item) => ({
                    label: item?.case_name,
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
  );
};
