import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { SelectForm } from "../ui-pattern/form-field/select-form";
import ComposedChart from "../ui/composed-chart";

type TLineBarComposedChart = {
  title?: string;
  description?: string;
  data: {
    label: string;
    production_quantity: number;
    ng_quantity: number;
    defect: number | null;
  }[];
  isLoading?: boolean;
  selected?: string;
  isMode?: boolean;
};

const LineBarComposedChart: FC<TLineBarComposedChart> = ({
  title,
  description,
  data,
  isLoading = false,
  selected,
  isMode = false,
}) => {
  const [mode, setMode] = useState("");

  return (
    <div className="flex h-[25rem] flex-col gap-2 rounded-md border p-2">
      <div className="flex flex-col justify-between gap-2 md:flex-row lg:flex-row">
        <div className={cn("w-full")}>
          <h1 className="text-sm font-semibold">{title}</h1>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {isMode && (
          <SelectForm
            value={mode}
            className="w-full md:w-[6rem] lg:w-[6rem]"
            onChange={(e) => setMode(e.target.value)}
            placeholder="Default"
            options={[
              {
                label: "PPM",
                value: "ppm",
              },
            ]}
          />
        )}
      </div>

      <div className=" flex h-0 flex-grow flex-col">
        {data?.length === 0 ? (
          <div className="flex h-full w-full justify-center">
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
            data={data?.map((info) => ({ ...info, defect: (info?.defect ?? 0) * (mode === "ppm" ? 10000 : 1) }))}
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

        <div className="flex w-full justify-center gap-2 rounded text-xs">
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
  );
};

export default LineBarComposedChart;
