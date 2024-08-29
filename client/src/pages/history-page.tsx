import { DefectDetail } from "@/components/common/defect-detail";
import { PageHeader } from "@/components/common/page-header";
import { CreateUpdateDefect } from "@/components/form";
import { DateInputForm } from "@/components/ui-pattern/form-field/input-form";
import { SelectForm } from "@/components/ui-pattern/form-field/select-form";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { GET_TIME_SLOTS, getTimeSlotByDateTimestamp } from "@/helpers";
import { PROCESS_LIST } from "@/helpers/common.helper";
import {
  renderFormattedDate,
  renderFormattedDateWithTime,
  renderFormattedPayloadDate,
} from "@/helpers/date-time.helper";
import { ExcelHelper } from "@/helpers/excel.helper";
import { cn } from "@/lib/utils";
import { useDefect } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TDefect } from "@/types";
import { FC, useMemo, useState } from "react";

export const HistoryPage: FC = () => {
  const { useGetRawDefects, mutateDeleteDefect } = useDefect();

  const { defectList } = useAtomStore();
  const [isOpenDefectDetail, setIsOpenDefectDetail] = useState<boolean>(false);
  const [isOpenDefectEdit, setIsOpenDefectEdit] = useState<boolean>(false);
  const [selectedDefect, setSelectedDefect] = useState<TDefect | null>(null);

  const [filterHistory, setFilterHistory] = useState({
    date: new Date()?.toISOString().split("T")[0],
    time_slot: "08:00 - 08:00",
  });

  //* Summary Filter NOT USED
  const [historyFilter, setHistoryFilter] = useState<{
    mode: "daily" | "date_range";
    shift?: "DAY" | "NIGHT";
    process?: string;
    start_date_time: string;
    end_date_time: string;
  }>({
    mode: "daily",
    start_date_time: "",
    end_date_time: "",
    shift: "DAY",
    process: "CUTTING",
  });

  const excelHelper = new ExcelHelper();

  const [allFilter, setAllFilter] = useState<{
    process: string[];
    shift: string[];
  }>({
    process: [],
    shift: [],
  });

  const getRequiredRawDefects = () => {
    let start_date_time = "";
    let end_date_time = "";

    const dateTime =
      filterHistory?.time_slot === "08:00 - 08:00"
        ? {
            start: GET_TIME_SLOTS(filterHistory?.date)?.[0]?.date_time,
            end: GET_TIME_SLOTS(filterHistory?.date)?.[GET_TIME_SLOTS(filterHistory?.date)?.length - 1]?.date_time,
          }
        : {
            start:
              GET_TIME_SLOTS(filterHistory?.date)?.find((slot) => slot.value === filterHistory?.time_slot)?.date_time ||
              "",
            end:
              GET_TIME_SLOTS(filterHistory?.date)?.find((slot) => slot.value === filterHistory?.time_slot)?.date_time ||
              "",
          };

    if (historyFilter?.mode == "daily") {
      start_date_time = dateTime.start;
      end_date_time = dateTime.end;
    } else {
      const covertToUTC = (date: string | null | undefined): string => {
        if (date) {
          const parsedDate = new Date(date);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate.toISOString();
          } else {
            return "";
          }
        }
        return "";
      };

      start_date_time = covertToUTC(historyFilter?.start_date_time);
      end_date_time = covertToUTC(historyFilter?.end_date_time);
    }

    return { start_date_time, end_date_time };
  };

  const { refetch, isPending: isPendingRawDefects } = useGetRawDefects(
    getRequiredRawDefects()?.start_date_time,
    getRequiredRawDefects()?.end_date_time
  );

  const HEADER = useMemo(
    () =>
      [
        { label: "Date", key: "date" },
        { label: "Time", key: "time_slot" },
        {
          label: "Shift",
          key: "shift",
        },
        { label: "Process", key: "process" },
        { label: "Machine Name", key: "machine_name" },
        { label: "Part Code", key: "part_code" },
        { label: "Part Name", key: "part_name" },
        { label: "Total Quantity", key: "ng_quantity" },
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
        { label: "Case Name", key: "case_name" },
        { label: "NG Description", key: "ng_description" },
        { label: "Remarks", key: "remarks" },
        { label: "Inspector Name", key: "inspector_name" },
        { label: "Created At", key: "created_at" },
        { label: "Updated At", key: "updated_at" },
        { label: "Action", key: "action" },
      ]?.filter((header) => {
        if (historyFilter?.mode === "daily") {
          return header.key !== "date";
        }
        return true;
      }),
    [historyFilter]
  );

  const defectMapped = useMemo(
    () =>
      defectList
        ?.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
        ?.filter((defect) => {
          if (allFilter?.process?.length === 0) {
            return true;
          }
          return allFilter?.process?.includes(defect.process);
        })
        ?.filter((defect) => {
          if (allFilter?.shift?.length === 0) {
            return true;
          }
          return allFilter?.shift?.includes(defect.shift);
        })
        ?.map((defect) => ({
          ...defect,
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
                className="text-blue-500 hover:underline"
                onClick={() => {
                  console.log("defect", defect);
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
    [defectList, allFilter]
  );

  const summaryMapped = (key: keyof TDefect): number => {
    return (
      defectMapped?.reduce((acc, curr) => {
        const value = curr[key];
        const numericValue = typeof value === "number" ? value : 0;
        return acc + (isNaN(numericValue) ? 0 : numericValue);
      }, 0) ?? 0
    );
  };

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <main className="flex h-full w-full flex-col gap-2">
        <PageHeader title="ประวัติการบันทึก / History" description="รายการประวัติการบันทึก / History list" />
        <Tabs defaultValue="raw-data" className="flex h-full flex-col">
          <TabsContent value="raw-data" className="h-full">
            <div className="flex h-full flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <SelectForm
                  options={[
                    {
                      label: "รายวัน / Daily",
                      value: "daily",
                    },
                    {
                      label: "ช่วงวันที่ / Date Range",
                      value: "date_range",
                    },
                  ]}
                  className="w-full md:w-[14rem]"
                  value={historyFilter?.mode}
                  onChange={(e) => {
                    const now = new Date();
                    const hour = now.getHours();
                    const minute = now.getMinutes();
                    const nowDateTime = `${now?.toISOString().split("T")[0]}T${hour}:${minute}`;
                    setHistoryFilter({
                      ...historyFilter,
                      mode: e.target.value as "daily" | "date_range",
                      start_date_time: e.target.value === "date_range" ? nowDateTime : "",
                      end_date_time: e.target.value === "date_range" ? nowDateTime : "",
                    });
                  }}
                />
                {historyFilter?.mode === "date_range" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <DateInputForm
                      type="datetime-local"
                      onChange={(e) => {
                        setHistoryFilter({
                          ...historyFilter,
                          start_date_time: e.target.value,
                        });
                      }}
                      value={historyFilter?.start_date_time}
                      max={historyFilter?.end_date_time}
                    />
                    <p className="hidden text-sm md:block">ถึง</p>
                    <DateInputForm
                      type="datetime-local"
                      onChange={(e) => {
                        setHistoryFilter({
                          ...historyFilter,
                          end_date_time: e.target.value,
                        });
                      }}
                      value={historyFilter?.end_date_time}
                      min={historyFilter?.start_date_time}
                      disabled={historyFilter?.start_date_time === ""}
                    />
                  </div>
                ) : (
                  <>
                    <DateInputForm
                      value={filterHistory?.date}
                      onChange={(e) => {
                        setFilterHistory({
                          ...filterHistory,
                          date: renderFormattedPayloadDate(e.target.value) ?? "",
                        });
                      }}
                      className="w-full md:w-[14rem]"
                    />
                    {allFilter?.shift?.length === 0 && (
                      <SelectForm
                        options={GET_TIME_SLOTS(filterHistory?.date, true)}
                        value={filterHistory?.time_slot}
                        onChange={(e) => {
                          setFilterHistory({
                            ...filterHistory,
                            time_slot: e.target.value,
                          });
                        }}
                        className="w-full md:w-[14rem]"
                      />
                    )}
                  </>
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full md:w-max">
                      {Object.keys(allFilter).reduce(
                        (acc, curr) => acc + allFilter[curr as keyof typeof allFilter]?.length,
                        0
                      ) === 0
                        ? "Filter"
                        : `Filtered ${Object.keys(allFilter).reduce(
                            (acc, curr) => acc + allFilter[curr as keyof typeof allFilter]?.length,
                            0
                          )}`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="space-y-1">
                    <div className="space-y-1">
                      <div className="flex w-full items-center justify-between">
                        <p className="text-sm font-semibold">Filter by Process</p>
                        <button
                          onClick={() =>
                            setAllFilter({
                              ...allFilter,
                              process: [],
                            })
                          }
                          className="text-xs text-red-500 hover:underline"
                        >
                          Reset
                        </button>
                      </div>
                      <div className="flex flex-col">
                        {PROCESS_LIST?.map((process, _index) => (
                          <div className="flex items-center gap-2" key={_index}>
                            <Checkbox
                              id={process}
                              name={process}
                              checked={allFilter?.process?.includes(process)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setAllFilter({
                                    ...allFilter,
                                    process: [...allFilter?.process, process],
                                  });
                                } else {
                                  setAllFilter({
                                    ...allFilter,
                                    process: allFilter?.process?.filter((item) => item !== process),
                                  });
                                }
                              }}
                            />
                            <label htmlFor={process} className="text-sm">
                              {process}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex w-full items-center justify-between">
                        <p className="text-sm font-semibold">Filter by Shift</p>
                        <button
                          onClick={() =>
                            setAllFilter({
                              ...allFilter,
                              shift: [],
                            })
                          }
                          className="text-xs text-red-500 hover:underline"
                        >
                          Reset
                        </button>
                      </div>
                      <div className="flex flex-col">
                        {["DAY", "NIGHT"]?.map((shift, __index) => (
                          <div className="flex items-center gap-2" key={__index}>
                            <Checkbox
                              id={shift}
                              name={shift}
                              checked={allFilter?.shift?.includes(shift)}
                              onCheckedChange={(checked) => {
                                setFilterHistory({
                                  ...filterHistory,
                                  time_slot: "00:00 - 23:59",
                                });
                                if (checked) {
                                  setAllFilter({
                                    ...allFilter,
                                    shift: [...allFilter?.shift, shift],
                                  });
                                } else {
                                  setAllFilter({
                                    ...allFilter,
                                    shift: allFilter?.shift?.filter((item) => item !== shift),
                                  });
                                }
                              }}
                            />
                            <label htmlFor={shift} className="text-sm">
                              {shift}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  onClick={() => {
                    const exportData = defectMapped;
                    excelHelper.downloadExcelData(exportData, "defects");
                  }}
                  className="w-full md:w-max"
                >
                  Excel Export
                </Button>
              </div>
              {isPendingRawDefects ? (
                <div className="flex h-full flex-col items-center justify-center gap-1">
                  <Spinner />
                  <p className="ml-2">Loading...</p>
                </div>
              ) : (
                <div className="flex h-0 w-full flex-grow flex-col overflow-y-auto rounded-md border">
                  <Table className="relative h-full w-full border-collapse">
                    <TableHeader className="sticky top-0 z-10 bg-secondary">
                      <TableRow className="whitespace-nowrap">
                        {HEADER?.map((header, __index) => (
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
                        <TableCell colSpan={historyFilter?.mode == "daily" ? 6 : 7}>Total Summary</TableCell>
                        <TableCell className="text-right">{summaryMapped("ng_quantity")}</TableCell>
                        <TableCell className="text-right">{summaryMapped("rework_quantity")}</TableCell>
                        <TableCell className="text-right">{summaryMapped("scrap_quantity")}</TableCell>
                        <TableCell className="text-right">{summaryMapped("rework_cost_per_unit")}</TableCell>
                        <TableCell className="text-right">{summaryMapped("scrap_cost_per_unit")}</TableCell>
                        <TableCell colSpan={8}></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
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
                process: selectedDefect?.process || "",
                part_code: selectedDefect?.part_code || "",
                ng_id: selectedDefect?.ng_id || "",
                ng_quantity: selectedDefect?.ng_quantity || null,
                machine_name: selectedDefect?.machine_name || null,
                rework_quantity: selectedDefect?.rework_quantity || null,
                rework_cost_per_unit: selectedDefect?.rework_cost_per_unit || null,
                scrap_quantity: selectedDefect?.scrap_quantity || null,
                scrap_cost_per_unit: selectedDefect?.scrap_cost_per_unit || null,
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

//  <TabsContent value="summary" className="h-full">
//         <div className="flex h-full flex-col gap-2">
//           <div className="flex flex-wrap items-center gap-2">
//             <SelectForm
//               options={[
//                 {
//                   label: "รายวัน / Daily",
//                   value: "daily",
//                 },
//                 {
//                   label: "ช่วงเวลา / Time Slot",
//                   value: "time_slot",
//                 },
//               ]}
//               value={summaryFilter?.mode}
//               onChange={(e) => {
//                 setSummaryFilter({
//                   ...summaryFilter,
//                   mode: e.target.value,
//                   time_slot: getNowTimeSlot()?.value,
//                 });
//               }}
//               className="w-full md:w-[14rem]"
//             />
//             <DateInputForm
//               value={summaryFilter?.date}
//               onChange={(e) => {
//                 setSummaryFilter({
//                   ...summaryFilter,
//                   date: renderFormattedPayloadDate(e.target.value) ?? "",
//                 });
//               }}
//               className="w-full md:w-[14rem]"
//             />
//             {summaryFilter?.mode === "time_slot" && (
//               <SelectForm
//                 options={getTimeSlots()}
//                 value={summaryFilter?.time_slot}
//                 onChange={(e) => {
//                   setSummaryFilter({
//                     ...summaryFilter,
//                     time_slot: e.target.value,
//                   });
//                 }}
//                 className="w-full md:w-[14rem]"
//               />
//             )}
//           </div>
//           <div className="flex h-full w-full flex-col overflow-y-auto rounded-md border">
//             {isPendingSummary ? (
//               <div className="flex h-full flex-col items-center justify-center gap-1">
//                 <Spinner />
//                 <p className="ml-2">Loading...</p>
//               </div>
//             ) : (
//               <DefectSummaryByDate />
//             )}
//           </div>
//         </div>
//       </TabsContent>
