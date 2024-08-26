import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getTimeSlotByDateTimestamp } from "@/helpers";
import { renderFormattedDate, renderFormattedDateWithTime } from "@/helpers/date-time.helper";
import { cn } from "@/lib/utils";
import { TDefect } from "@/types";
import { FC, useMemo } from "react";

interface DefectDetailProps {
  defect: TDefect;
  onEdit?: (defect: TDefect) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DefectDetail: FC<DefectDetailProps> = ({ defect, isOpen, onClose }) => {
  if (!defect) {
    return null;
  }

  const HEADER = useMemo(
    () => [
      { label: "Date", key: "date" },
      { label: "Time Slot", key: "datetime" },
      { label: "Process", key: "process" },
      { label: "Machine Name", key: "machine_name" },
      { label: "Part Code", key: "part_code" },
      { label: "NG Quantity", key: "ng_quantity" },
      { label: "Rework Quantity", key: "rework_quantity" },
      {
        label: "Rework Cost Per Unit (USD)",
        key: "rework_cost_per_unit",
      },
      { label: "Scrap Quantity", key: "scrap_quantity" },
      {
        label: "Scrap Cost Per Unit (USD)",
        key: "scrap_cost_per_unit",
      },
      { label: "Remarks", key: "remarks" },
      { label: "Created At", key: "created_at" },
      { label: "Updated At", key: "updated_at" },
      { label: "Case Name", key: "case_name" },
      { label: "NG Description", key: "ng_description" },
      { label: "Inspector Name", key: "inspector_name" },
    ],
    []
  );

  const newDefect = {
    ...defect,
    datetime: getTimeSlotByDateTimestamp(new Date(defect?.datetime)?.getTime())?.label,
    date: renderFormattedDate(new Date(defect?.datetime)),
    created_at: renderFormattedDateWithTime(new Date(defect?.created_at)),
    updated_at: renderFormattedDateWithTime(new Date(defect?.updated_at)),
  };

  const mapDefect = useMemo(
    () =>
      HEADER?.map((h) => ({
        label: h?.label,
        value: newDefect[h.key as keyof TDefect] ?? "-",
      })),
    [defect]
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="flex max-h-[40rem] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>รายละเอียดข้อบกพร่อง / Defect Detail</DialogTitle>
          <DialogDescription>
            {newDefect?.date} - {newDefect?.datetime}
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border bg-gray-100 p-2">
          <h2 className="text-lg font-semibold">{defect?.part_code}</h2>
          <p className="text-sm text-gray-500">{defect?.case_name}</p>
        </div>
        <div className="h-full w-full space-y-4 overflow-y-auto">
          {defect?.image && (
            <div className="space-y-1">
              <p className="text-sm font-semibold">รูปภาพ / Image</p>
              <img
                src={defect?.image ?? "https://via.placeholder.com/300"}
                alt="defect"
                className="h-auto w-full rounded-md object-cover"
              />
            </div>
          )}
          <div className="space-y-1 rounded-md border p-2">
            <p className="text-sm font-semibold">รายละเอียด / Description</p>
            <div className="rounded-md">
              {/* {HEADER.map((h, j) => (
                <div
                  key={`defect-detail-${j}`}
                  className={cn(
                    "grid w-full grid-cols-2 p-1",
                    "border-b border-gray-100",
                    j % 2 === 0 ? "bg-gray-50" : "bg-white",
                    j === HEADER.length - 1
                      ? "border-b-0"
                      : ""
                  )}
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {h.label}
                    </p>
                  </div>
                  <div className="flex w-full justify-end">
                    <p className="text-sm">
                      {defect[h.key as keyof TDefect] ??
                        "-"}
                    </p>
                  </div>
                </div>
              ))} */}
              {mapDefect?.map((h, j) => (
                <div
                  key={`defect-detail-${j}`}
                  className={cn(
                    "grid w-full grid-cols-2 p-1",
                    "border-b border-gray-100",
                    j % 2 === 0 ? "bg-gray-50" : "bg-white",
                    j === HEADER.length - 1 ? "border-b-0" : ""
                  )}
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{h.label}</p>
                  </div>
                  <div className="flex w-full justify-end">
                    <p className="text-sm">{h.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
