import { cn } from "@/lib/utils";
import { FC } from "react";
import ComposedChart from "../ui/composed-chart";

type TLineBarComposedChart = {
  data: {
    label: string;
    production_quantity: number;
    ng_quantity: number;
    defect: number | null;
  }[];
  isLoading?: boolean;
  selected?: string;
};

const LineBarComposedChart: FC<TLineBarComposedChart> = ({ data, isLoading = false, selected }) => {
  return (
    <div className="flex h-[25rem] flex-col gap-2 rounded-md border p-2">
      <div className="flex flex-col justify-between gap-2 md:flex-row lg:flex-row">
        <div className={cn("w-full")}>
          <h1 className="text-sm font-semibold">
            การผลิตทั้งหมดเทียบกับงานเสีย / Total production compared to ng work
          </h1>
          <p className="text-xs text-muted-foreground">
            กราฟรายละเอียดการผลิตทั้งหมดเทียบกับงานเสีย / A detailed graph of total production versus scrap.{" "}
          </p>
        </div>
      </div>

      <div className=" flex h-0 flex-grow flex-col">
        {data?.length === 0 ? (
          <div className="flex w-full justify-center">
            <p className="text-xs">
              {isLoading
                ? "กำลังโหลดข้อมูล / Loading data"
                : selected
                  ? "เลือกชิ้นงานที่ต้องการดู / Select the part you want to see"
                  : "ไม่พบข้อมูล / No data found"}
            </p>
          </div>
        ) : (
          <ComposedChart
            data={data}
            Config={[
              {
                key: "production_quantity",
                color: "#102693",
              },
              {
                key: "ng_quantity",
                color: "#FF2020",
              },
              {
                key: "defect",
                chart: "Line",
                type: "linear",
                color: "#ff7300",
                yAxisId: "right",
                label: "%",
              },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default LineBarComposedChart;
