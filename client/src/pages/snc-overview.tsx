import { PageHeader } from "@/components/common/page-header";
import { DetailsSheet, EmptyState, OverviewCard } from "@/components/snc-overview";
import { Filtered } from "@/components/ui-pattern/filtered";
import { Spinner } from "@/components/ui/spinner";
import { groupByField } from "@/helpers/array.helper";
import { DEFECTION_TYPE_OPTIONS, MODE_OPTIONS } from "@/helpers/common.helper";
import { renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { useSNCOverview } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { ProcessSelection, SNCOverviewData, SNCOverviewItem } from "@/types";
import { FC, useMemo, useState } from "react";

export interface FilteredState {
  mode: "daily" | "period" | "week" | "monthly";
  defect_type: "ALL" | "P" | "S";
  start_date: string;
  end_date: string;
}

// Utility function to group SNC overview list
const groupSncOverviewList = (sncOverviewList: SNCOverviewItem[]): SNCOverviewData[] => {
  const groupedByPlant = groupByField(sncOverviewList, "plant_code");
  return Object.keys(groupedByPlant).map((plantCode) => {
    const groupedData = groupedByPlant[plantCode];
    const processes = Object.keys(groupByField(groupedData, "process_id")).map((processId) => ({
      process_id: processId,
      process_name: groupedData.find((item) => item.process_id === processId)?.process_name || "",
      data: groupedData.filter((item) => item.process_id === processId),
    }));

    return { plant_code: plantCode, process: processes };
  });
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

  const { isLoading: isOverviewLoading } = useGetSncOverview(commonParams);
  useGetSncPartDetail({
    ...commonParams,
    part_id: partSelected ?? "",
    process_id: processSelected?.find((process) => process.plant_code === plantSelected)?.process_id ?? "",
  });

  const mapSncOverviewList = useMemo(() => groupSncOverviewList(sncOverviewList), [sncOverviewList]);

  // useEffect(() => {
  //   if (mapSncOverviewList.length > 0) {
  //     setProcessSelected((prev) =>
  //       prev.filter((process) => mapSncOverviewList.find((item) => item.plant_code === process.plant_code))
  //     );
  //   }
  // }, [mapSncOverviewList]);

  console.log("processSelected", processSelected);

  if (isOverviewLoading) {
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
      {mapSncOverviewList.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:col-span-2">
          {mapSncOverviewList.map((item) => (
            <OverviewCard
              key={item.plant_code}
              plantCode={item.plant_code}
              processes={item.process}
              processSelected={processSelected}
              setPlantSelected={setPlantSelected}
              setProcessSelected={setProcessSelected}
              setPartSelected={setPartSelected}
              mapSncOverviewList={mapSncOverviewList}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
      <DetailsSheet
        plantSelected={plantSelected}
        setPlantSelected={setPlantSelected}
        mapSncOverviewList={mapSncOverviewList}
        processSelected={processSelected}
        setProcessSelected={setProcessSelected}
        partSelected={partSelected}
        setPartSelected={setPartSelected}
        sncPartDetailList={sncPartDetailList}
      />
    </div>
  );
};
