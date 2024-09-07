import { DefectDetail } from "@/components/common/defect-detail";
import { CreateUpdateDefect } from "@/components/form";
import { DefectOptionFilter, LoggingTabs, TValue } from "@/components/history";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTimeSlotByDateTimestamp } from "@/helpers";
import {
  renderFormattedDate,
  renderFormattedDateWithTime,
  renderFormattedPayloadDate,
} from "@/helpers/date-time.helper";
import { DEFECT_HEADER, getRequiredRawDefects, summaryMapped } from "@/helpers/history-defect.helper";
import { cn } from "@/lib/utils";
import { useDefect } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TDefect } from "@/types";
import { FC, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const DefectHistory: FC = () => {
  const { defectList, processList, machineList } = useAtomStore();
  const { useGetRawDefects, mutateDeleteDefect } = useDefect();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpenDefectDetail, setIsOpenDefectDetail] = useState<boolean>(false);
  const [isOpenDefectEdit, setIsOpenDefectEdit] = useState<boolean>(false);
  const [selectedDefect, setSelectedDefect] = useState<TDefect | null>(null);
  const [values, setValues] = useState<TValue>({
    mode: "daily",
    shift: "DAY",
    process_id: "",
    start_date: renderFormattedPayloadDate(new Date()) ?? "",
    end_date: renderFormattedPayloadDate(new Date()) ?? "",
    time_slot: "08:00 - 08:00",
  });
  const { start_date_time, end_date_time } = getRequiredRawDefects(values);
  const { refetch, isPending: isPendingRawDefects } = useGetRawDefects(start_date_time, end_date_time);
  const defectMapped = useMemo(
    () =>
      defectList
        ?.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
        ?.filter((defect) => {
          if (values?.process_id?.length === 0) {
            return true;
          }
          return values?.process_id?.includes(defect.process_id);
        })
        ?.filter((defect) => {
          if (values?.shift?.length === 0) {
            return true;
          }
          return values?.shift?.includes(defect.shift);
        })
        ?.map((defect) => ({
          ...defect,
          machine_id: machineList?.find((machine) => machine.machine_id === defect.machine_id)?.machine_name || "",
          process_id: processList?.find((process) => process.process_id === defect.process_id)?.process_name || "",
          date: renderFormattedDate(new Date(defect.datetime)),
          datetime: getTimeSlotByDateTimestamp(new Date(defect.datetime).getTime())?.label || "",
          created_at: renderFormattedDateWithTime(new Date(defect.created_at)) || "",
          updated_at: renderFormattedDateWithTime(new Date(defect.updated_at)) || "",
          ng_quantity: defect?.ng_quantity == 0 ? "" : defect?.ng_quantity,
          rework_quantity: defect?.rework_quantity || "",
          scrap_quantity: defect?.scrap_quantity || "",
          rework_cost_per_unit: parseFloat(defect?.rework_cost_per_unit?.toString() || "0") || "",
          scrap_cost_per_unit: parseFloat(defect?.scrap_cost_per_unit?.toString() || "0") || "",
          action: () => (
            <div className="flex items-center gap-2">
              <button
                className="text-primary hover:underline"
                onClick={() => {
                  setSelectedDefect(defect);
                  setIsOpenDefectDetail(true);
                }}
              >
                View
              </button>
              <button
                className="text-yellow-500 hover:underline"
                onClick={() => {
                  setSelectedDefect(defect);
                  setIsOpenDefectEdit(true);
                }}
              >
                Edit
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="text-red-500 hover:underline">Delete</button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>คุณต้องการลบข้อมูล {defect?.part_code} ใช่หรือไม่?</AlertDialogTitle>
                    <AlertDialogDescription>
                      การกระทำนี้ไม่สามารถย้อนกลับได้ / This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        const res = await mutateDeleteDefect(defect.defects_log_id);
                        if (res) {
                          refetch();
                        }
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ),
        })),
    [defectList]
  );
  const HEADER = DEFECT_HEADER(values);
  const summary = (key: keyof TDefect) => summaryMapped(key, defectMapped as TDefect[]);

  return (
    <div className="flex h-full flex-col gap-2">
      <LoggingTabs
        activeTab={pathname}
        setActiveTab={navigate}
        tabsList={[
          {
            label: "ประวัติบันทึกยอดการเสีย / History of Defect",
            route: "/history/defect",
          },
          {
            label: "ประวัติบันทึกยอดการผลิต / History of Production",
            route: "/history/production",
          },
        ]}
      />
      <div className="flex h-full flex-col gap-2 p-2">
        <DefectOptionFilter values={values} setValues={setValues} />
        {isPendingRawDefects ? (
          <div className="grid h-full place-items-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex h-0 w-full flex-grow flex-col overflow-y-auto rounded-md border">
            <Table className="relative h-full w-full border-collapse">
              <TableHeader className="sticky top-0 z-10 bg-secondary">
                <TableRow className="whitespace-nowrap">
                  {DEFECT_HEADER(values)?.map((header, __index) => (
                    <TableHead
                      key={`${header.label}-${__index}`}
                      className={cn(
                        "whitespace-nowrap",
                        !isNaN(defectMapped?.[0]?.[header.key as keyof TDefect] as number) && "text-right"
                      )}
                    >
                      {header.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {defectMapped?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={HEADER.length}>No data available</TableCell>
                  </TableRow>
                )}
                {defectMapped?.map((defect, __defect_index) => (
                  <TableRow className="whitespace-nowrap" key={`${defect?.defects_log_id}-${__defect_index}`}>
                    {HEADER?.map((header, header_index) => (
                      <TableCell
                        className={cn(
                          "whitespace-nowrap",
                          !isNaN(defect?.[header.key as keyof TDefect] as number) && "text-right"
                        )}
                        key={`${defect?.defects_log_id}-${header_index}`}
                      >
                        {typeof defect?.[header?.key as keyof TDefect] === "function" && defect
                          ? defect?.action()
                          : defect && defect?.[header?.key as keyof TDefect]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={values?.mode == "daily" ? 7 : 8}>Total Summary</TableCell>
                  <TableCell className="text-right">{summary("production_quantity")}</TableCell>
                  <TableCell className="text-right">{summary("ng_quantity")}</TableCell>
                  <TableCell className="text-right">{summary("rework_quantity")}</TableCell>
                  <TableCell className="text-right">{summary("scrap_quantity")}</TableCell>
                  <TableCell className="text-right">{summary("rework_cost_per_unit")}</TableCell>
                  <TableCell className="text-right">{summary("scrap_cost_per_unit")}</TableCell>
                  <TableCell colSpan={8}></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </div>
      <DefectDetail
        defect={selectedDefect as TDefect}
        isOpen={isOpenDefectDetail}
        onClose={() => setIsOpenDefectDetail(false)}
      />

      <Drawer
        open={isOpenDefectEdit}
        onClose={() => setIsOpenDefectEdit(false)}
        onOpenChange={(open) => setIsOpenDefectEdit(open)}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>แก้ไขข้อมูล / Edit Defect</DrawerTitle>
            <DrawerDescription>แก้ไขข้อมูลการบันทึกของเสีย / Edit defect information</DrawerDescription>
          </DrawerHeader>
          <div className="flex max-h-[60dvh] flex-col gap-4 overflow-y-auto p-4">
            <CreateUpdateDefect
              onClose={() => setIsOpenDefectEdit(false)}
              isTitleVisible={false}
              data={{
                ...selectedDefect,
                defects_log_id: selectedDefect?.defects_log_id,
                datetime: "",
                date: renderFormattedPayloadDate(selectedDefect?.datetime) ?? "",
                time_slot: getTimeSlotByDateTimestamp(new Date(selectedDefect?.datetime ?? "")?.getTime())?.value,
                process_id: selectedDefect?.process_id || "",
                part_id: selectedDefect?.part_id || "",
                case_id: selectedDefect?.case_id || "",
                ng_quantity: selectedDefect?.ng_quantity || null,
                machine_id: selectedDefect?.machine_id || "",
                rework_quantity: selectedDefect?.rework_quantity || null,
                scrap_quantity: selectedDefect?.scrap_quantity || null,
                image: selectedDefect?.image || "",
                remarks: selectedDefect?.remarks || "",
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
