import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { SelectForm } from "../ui-pattern/form-field/select-form";
import PieChartUI, { ColorPieChartUI } from "../ui/pie-chart";

type TPieChart = {
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

const PieChart: FC<TPieChart> = ({ title, description, data, isLoading = false, selected, isMode = false }) => {
  const [mode, setMode] = useState("production_quantity");

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
            className="w-full md:w-[6.2rem] lg:w-[6.2rem]"
            onChange={(e) => setMode(e.target.value)}
            options={[
              {
                label: "Production",
                value: "production_quantity",
              },
              {
                label: "NG",
                value: "ng_quantity",
              },
            ]}
          />
        )}
      </div>

      <div className=" relative flex h-0  flex-grow ">
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
          <div className=" flex h-full w-full items-center justify-center">
            <PieChartUI
              data={data?.map((info) => ({
                label: info?.label,
                value: info?.[(mode as "production_quantity" | "ng_quantity" | "defect") ?? "production_quantity"] ?? 0,
              }))}
            />
          </div>
        )}

        <div className="absolute right-0 top-0 flex h-full min-w-max flex-col justify-center gap-2 overflow-auto pr-2 text-xs">
          {data?.map(({ label }, i) => (
            <div className="w-max" key={i}>
              <div
                className="mr-1 inline-block h-2 w-2 rounded-full"
                style={{
                  background: ColorPieChartUI[i],
                }}
              />
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
