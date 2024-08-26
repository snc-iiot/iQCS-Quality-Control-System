import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTimeSlotByDateTimestamp } from "@/helpers";
import { cn } from "@/lib/utils";
import { useAtomStore } from "@/store";
import { TDefectSummary } from "@/types";
import { FC } from "react";

export const DefectSummaryByDate: FC = () => {
  const { defectSummaryList } = useAtomStore();

  const HEADER = [
    { label: "Date Time", key: "datetime" },
    { label: "Process", key: "process" },
    { label: "NG Quantity", key: "ng_quantity" },
    { label: "Rework Quantity", key: "rework_quantity" },

    { label: "Scrap Quantity", key: "scrap_quantity" },
    {
      label: "Rework Cost Per Unit (USD)",
      key: "rework_cost_per_unit",
    },
    {
      label: "Scrap Cost Per Unit (USD)",
      key: "scrap_cost_per_unit",
    },
    { label: "Inspector Name", key: "inspector_name" },
  ];

  const defectMap = defectSummaryList?.map((defectSummary) => {
    return {
      ...defectSummary,
      datetime: getTimeSlotByDateTimestamp(new Date(defectSummary?.datetime).getTime())?.label || "",
      rework_cost_per_unit: parseFloat(defectSummary?.rework_cost_per_unit?.toString() || "0"),
      scrap_cost_per_unit: parseFloat(defectSummary?.scrap_cost_per_unit?.toString() || "0"),
    };
  });

  const summaryMapped = (key: keyof TDefectSummary): number => {
    return (
      defectSummaryList?.reduce((acc, curr) => {
        const value = curr[key];
        const numericValue = typeof value === "number" ? value : 0;
        return acc + (isNaN(numericValue) ? 0 : numericValue);
      }, 0) ?? 0
    );
  };

  return (
    <Table className="relative h-full w-full border-collapse">
      <TableHeader className="sticky top-0 z-10 bg-secondary">
        <TableRow className="whitespace-nowrap">
          {HEADER.map((item) => (
            <TableHead
              key={item.key}
              className={cn(
                "whitespace-nowrap border-red-600",
                !isNaN(Number(defectMap?.[0]?.[item.key as keyof TDefectSummary])) && "text-right"
              )}
            >
              {item.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {defectMap?.length === 0 && (
          <TableRow>
            <TableCell colSpan={HEADER.length}>No data available</TableCell>
          </TableRow>
        )}
        {defectMap?.map((defectSummary, defect_index) => (
          <TableRow key={`defect-summary-${defect_index}`} className="whitespace-nowrap">
            {HEADER.map((item) => (
              <TableCell
                key={item?.key}
                className={cn(
                  "whitespace-nowrap",
                  !isNaN(Number(defectSummary?.[item.key as keyof TDefectSummary])) && "text-right"
                )}
              >
                {defectSummary?.[item.key as keyof TDefectSummary]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Summary</TableCell>
          <TableCell className="text-right">{summaryMapped("ng_quantity")}</TableCell>
          <TableCell className="text-right">{summaryMapped("rework_quantity")}</TableCell>
          <TableCell className="text-right">{summaryMapped("rework_cost_per_unit")}</TableCell>
          <TableCell className="text-right">{summaryMapped("scrap_quantity")}</TableCell>
          <TableCell className="text-right">{summaryMapped("scrap_cost_per_unit")}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
