import { FileChartPie } from "lucide-react";
import { FC } from "react";

export const EmptyState: FC = () => {
  return (
    <div className="flex h-[25rem] flex-col items-center justify-center gap-2 text-sm">
      <FileChartPie className="h-10 w-10 text-gray-400" strokeWidth={1.5} />
      No data available for this period of time or defect type
    </div>
  );
};
