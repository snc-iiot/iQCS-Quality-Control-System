import { PageHeader } from "@/components/common/page-header";
import { Filtered } from "@/components/ui-pattern/filtered";
import { DEFECTION_TYPE_OPTIONS, MODE_OPTIONS } from "@/helpers/common.helper";
import { renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { useSNCOverview } from "@/services/hooks";
import { FC, useState } from "react";

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

  const { useGetSncOverview } = useSNCOverview();

  const { isLoading: isSncOverviewLoading } = useGetSncOverview({
    start_date: filtered.start_date,
    end_date: filtered.end_date,
    defect_type: filtered.defect_type,
  });

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
      <div></div>
    </div>
  );
};
