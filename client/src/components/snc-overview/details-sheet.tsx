import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
import ComposedChart from "@/components/ui/composed-chart";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mapCompositionData } from "@/helpers/dashboard.helper";
import { ProcessSelection, SNCOverviewData, TSNCPartDetail } from "@/types";
import { ChangeEvent, FC, ReactNode, useEffect } from "react";

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
}) => {
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
        <SheetHeader>
          <SheetTitle>รายงานข้อมูลของโรงงาน {plantSelected}</SheetTitle>
          <SheetDescription>
            รายงานข้อมูลของโรงงาน {plantSelected} ทั้งหมด {selectedPlantData?.process?.length} กระบวนการ
          </SheetDescription>
          {filtered}
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
                      data={
                        process.data?.map((item) => ({
                          label: item.part_name,
                          production: item.production_quantity,
                          ng: item.ng_quantity,
                          percentage: item.defects_percentage?.toFixed(2),
                        })) ?? []
                      }
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
                      options={selectedPlantData.process.map((proc) => ({
                        label: proc.process_name,
                        value: proc.process_id,
                      }))}
                      placeholder="กรุณาเลือกกระบวนการ"
                      className="w-full md:w-[10rem] lg:w-[10rem]"
                      value={processSelected.find((p) => p.plant_code === plantSelected)?.process_id || ""}
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
