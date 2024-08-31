import { DefectDetail } from "@/components/common/defect-detail";
// import { PageHeader } from "@/components/common/page-header";
import { CreateUpdateDefect, CreateUpdateProductivity } from "@/components/form";
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
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GET_TIME_SLOTS, getTimeSlotByDateTimestamp } from "@/helpers";
import { groupByField } from "@/helpers/array.helper";
import {
  getStartDateEndDateOfWeek,
  getWeekString,
  renderFormattedDate,
  renderFormattedDateWithTime,
  renderFormattedPayloadDate,
} from "@/helpers/date-time.helper";
import { ExcelHelper } from "@/helpers/excel.helper";
import { cn } from "@/lib/utils";
import { useDefect } from "@/services/hooks";
import { useProductivity } from "@/services/hooks/use-productivity";
import { useAtomStore } from "@/store";
import { TDefect, TProductivity } from "@/types";
import { FC, useMemo, useState } from "react";

export const HistoryPage: FC = () => {
  const { useGetRawDefects, mutateDeleteDefect } = useDefect();
  const { useGetRawProductivitys, mutateDeleteProductivity } = useProductivity();

  const { defectList, productivityList, processList } = useAtomStore();
  const [isOpenDefectDetail, setIsOpenDefectDetail] = useState<boolean>(false);
  const [isOpenDefectEdit, setIsOpenDefectEdit] = useState<boolean>(false);
  const [selectedDefect, setSelectedDefect] = useState<TDefect | null>(null);

  const [, setIsOpenProductivityDetail] = useState<boolean>(false);
  const [isOpenProductivityEdit, setIsOpenProductivityEdit] = useState<boolean>(false);
  const [selectedProductivity, setSelectedProductivity] = useState<TProductivity | null>(null);

  const [filterHistory, setFilterHistory] = useState({
    date: new Date()?.toISOString().split("T")[0],
    time_slot: "08:00 - 08:00",
  });

  //* Summary Filter NOT USED
  const [historyFilter, setHistoryFilter] = useState<{
    mode: string;
    shift?: "DAY" | "NIGHT";
    process_id?: string;
    start_date_time: string;
    end_date_time: string;
  }>({
    mode: "daily",
    start_date_time: renderFormattedPayloadDate(new Date()) ?? "",
    end_date_time: "",
    shift: "DAY",
    process_id: "",
  });

  const excelHelper = new ExcelHelper();

  const [allFilter, setAllFilter] = useState<{
    process_id: string[];
    shift: string[];
  }>({
    process_id: [],
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

  const { refetch: refetchProductivity, isPending: isPendingRawProductivitys } = useGetRawProductivitys(
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

  const HEADER_PRODUCTIVITY = useMemo(
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
        { label: "Total Quantity", key: "quantity" },
        { label: "Total NG Quantity", key: "ng_quantity" },
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

  const HEADER_PRODUCTIVITY2 = useMemo(
    () =>
      [
        { label: "Part Name", key: "part_name" },
        ...(historyFilter.shift === "DAY"
          ? [
              { label: "08:00 - 09:00", key: "08:00 - 09:00" },
              { label: "09:00 - 10:00", key: "09:00 - 10:00" },
              { label: "10:00 - 11:00", key: "10:00 - 11:00" },
              { label: "11:00 - 12:00", key: "11:00 - 12:00" },
              { label: "12:00 - 13:00", key: "12:00 - 13:00" },
              { label: "13:00 - 14:00", key: "13:00 - 14:00" },
              { label: "14:00 - 15:00", key: "14:00 - 15:00" },
              { label: "15:00 - 16:00", key: "15:00 - 16:00" },
              { label: "16:00 - 17:00", key: "16:00 - 17:00" },
              { label: "17:00 - 18:00", key: "17:00 - 18:00" },
              { label: "18:00 - 19:00", key: "18:00 - 19:00" },
              { label: "19:00 - 20:00", key: "19:00 - 20:00" },
            ]
          : [
              { label: "20:00 - 21:00", key: "20:00 - 21:00" },
              { label: "21:00 - 22:00", key: "21:00 - 22:00" },
              { label: "22:00 - 23:00", key: "22:00 - 23:00" },
              { label: "23:00 - 24:00", key: "23:00 - 24:00" },
              { label: "24:00 - 01:00", key: "24:00 - 01:00" },
              { label: "01:00 - 02:00", key: "01:00 - 02:00" },
              { label: "02:00 - 03:00", key: "02:00 - 03:00" },
              { label: "03:00 - 04:00", key: "03:00 - 04:00" },
              { label: "04:00 - 05:00", key: "04:00 - 05:00" },
              { label: "05:00 - 06:00", key: "05:00 - 06:00" },
              { label: "06:00 - 07:00", key: "06:00 - 07:00" },
              { label: "07:00 - 08:00", key: "07:00 - 08:00" },
            ]),
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
          if (allFilter?.process_id?.length === 0) {
            return true;
          }
          return allFilter?.process_id?.includes(defect.process_id);
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

  const productivityMapped = useMemo(
    () =>
      productivityList
        ?.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
        ?.filter((productivity) => {
          if (allFilter?.process_id?.length === 0) {
            return true;
          }
          return allFilter?.process_id?.includes(productivity.process_id);
        })
        ?.filter((productivity) => {
          if (allFilter?.shift?.length === 0) {
            return true;
          }
          return allFilter?.shift?.includes(productivity.shift);
        })
        ?.map((productivity) => ({
          ...productivity,
          date: renderFormattedDate(new Date(productivity.datetime)),
          datetime: getTimeSlotByDateTimestamp(new Date(productivity.datetime).getTime())?.label || "",
          created_at: renderFormattedDateWithTime(new Date(productivity.created_at)) || "",
          updated_at: renderFormattedDateWithTime(new Date(productivity.updated_at)) || "",
          ng_quantity: productivity?.ng_quantity == 0 ? "" : productivity?.ng_quantity,
          quantity: productivity?.quantity || "",
          action: () => (
            <div className="flex items-center gap-2">
              <button
                className="text-primary hover:underline"
                onClick={() => {
                  setSelectedProductivity(productivity);
                  setIsOpenProductivityDetail(true);
                }}
              >
                View
              </button>
              <button
                className="text-blue-500 hover:underline"
                onClick={() => {
                  setSelectedProductivity(productivity);
                  setIsOpenProductivityEdit(true);
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
                    <AlertDialogTitle>คุณต้องการลบข้อมูล {productivity?.part_code} ใช่หรือไม่?</AlertDialogTitle>
                    <AlertDialogDescription>
                      การกระทำนี้ไม่สามารถย้อนกลับได้ / This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={async () => {
                        const res = await mutateDeleteProductivity(productivity?.prod_log_id);
                        if (res) {
                          refetchProductivity();
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
    [productivityList, allFilter]
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

  const summaryProductivityMapped = (key: keyof TProductivity): number => {
    return (
      productivityMapped?.reduce((acc, curr) => {
        const value = curr[key];
        const numericValue = typeof value === "number" ? value : 0;
        return acc + (isNaN(numericValue) ? 0 : numericValue);
      }, 0) ?? 0
    );
  };

  type TMapData = {
    part_name: string;
    "08:00 - 09:00": number;
    "09:00 - 10:00": number;
    "10:00 - 11:00": number;
    "11:00 - 12:00": number;
    "12:00 - 13:00": number;
    "13:00 - 14:00": number;
    "14:00 - 15:00": number;
    "15:00 - 16:00": number;
    "16:00 - 17:00": number;
    "17:00 - 18:00": number;
    "18:00 - 19:00": number;
    "19:00 - 20:00": number;
    "20:00 - 21:00": number;
    "21:00 - 22:00": number;
    "22:00 - 23:00": number;
    "23:00 - 24:00": number;
    "24:00 - 01:00": number;
    "01:00 - 02:00": number;
    "02:00 - 03:00": number;
    "03:00 - 04:00": number;
    "04:00 - 05:00": number;
    "05:00 - 06:00": number;
    "06:00 - 07:00": number;
    "07:00 - 08:00": number;
  };

  const mapData = () => {
    const groupPartName = Object.keys(
      groupByField(productivityMapped?.filter((info) => info?.process_id === historyFilter?.process_id), "part_name")
    );
    const req: TMapData[] = [];

    for (let i = 0; i < groupPartName.length; i++) {
      const groupTimeSlot = groupByField(
        productivityMapped?.filter(
          (info) => info?.part_name === groupPartName[i] && info?.process_id === historyFilter?.process_id
        ),
        "time_slot"
      );
      const objectGroupTimeSlot = Object.keys(groupTimeSlot);

      req[i] = { ...req[i], part_name: groupPartName[i] } as TMapData;

      for (let j = 0; j < objectGroupTimeSlot.length; j++) {
        const sumOfQuantities = groupTimeSlot[objectGroupTimeSlot[j]].reduce<number>((acc, curr) => {
          const quantity = Number(curr.quantity ?? 0);
          return acc + quantity;
        }, 0);

        req[i] = { ...req[i], [objectGroupTimeSlot[j]]: sumOfQuantities } as TMapData;
      }
    }

    return req;
  };

  const summaryMapDataMapped = (key: keyof TMapData): number => {
    return (
      mapData()?.reduce((acc, curr) => {
        const value = curr[key];
        const numericValue = typeof value === "number" ? value : 0;
        return acc + (isNaN(numericValue) ? 0 : numericValue);
      }, 0) ?? 0
    );
  };

  console.log(historyFilter);

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <main className="flex h-full w-full flex-col gap-2">
        {/* <PageHeader
          title="ประวัติการบันทึก / History"
          description="รายการประวัติการบันทึก / History list"
        /> */}
        <Tabs defaultValue="summary" className="flex h-full flex-col">
          <TabsList className="max-w-max">
            <TabsTrigger value="summary">ประวัติการบันทึกยอดการผลิต / History</TabsTrigger>
            <TabsTrigger value="raw-data">ประวัติการบันทึก / History</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="h-full">
            <div className="flex h-full flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <SelectForm
                  options={[
                    {
                      label: "รายวัน / Daily",
                      value: "daily",
                    },
                    {
                      label: "ช่วงวัน / Period",
                      value: "period",
                    },
                    {
                      label: "สัปดาห์ / Week",
                      value: "week",
                    },
                    {
                      label: "รายเดือน / Monthly",
                      value: "monthly",
                    },
                  ]}
                  className="w-full md:w-[14rem]"
                  value={historyFilter?.mode}
                  onChange={(e) => {
                    setHistoryFilter({
                      ...historyFilter,
                      mode: e.target.value,
                      end_date_time: e.target.value === "period" ? historyFilter?.start_date_time : "",
                    });
                  }}
                />

                <div className="flex flex-wrap items-center gap-2">
                  {historyFilter?.mode === "week" && (
                    <Input
                      onChange={(e) => {
                        const value = e.target.value;
                        const [year, week] = value.split("-W");
                        const YEAR = parseInt(year);
                        const WEEK = parseInt(week);
                        const { startDate: start_date, endDate: end_date } = getStartDateEndDateOfWeek(WEEK, YEAR);
                        setHistoryFilter({
                          ...historyFilter,
                          start_date_time: renderFormattedPayloadDate(new Date(start_date)) ?? "",
                          end_date_time: renderFormattedPayloadDate(new Date(end_date)) ?? "",
                        });
                      }}
                      value={getWeekString(new Date(historyFilter?.start_date_time))}
                      className="block w-full md:w-[14rem] lg:w-[10rem]"
                      type="week"
                    />
                  )}

                  {(historyFilter?.mode === "daily" ||
                    historyFilter?.mode === "period" ||
                    historyFilter?.mode === "monthly") && (
                    <Input
                      className="block w-full md:w-[14rem] lg:w-[10rem]"
                      value={historyFilter?.start_date_time?.slice(0, historyFilter?.mode === "monthly" ? 7 : 10)}
                      onChange={(e) => {
                        const start_date_time = e.target.value + (historyFilter?.mode === "monthly" ? "-01" : "");
                        let end_date_time = historyFilter?.end_date_time;

                        if (historyFilter?.mode === "monthly") {
                          const [year, month] = start_date_time.split("-");
                          const endOfMonth = new Date(Number(year), Number(month), 0);
                          end_date_time = `${year}-${month}-${endOfMonth.getDate()}`;
                        }

                        setHistoryFilter({
                          ...historyFilter,
                          start_date_time,
                          end_date_time,
                        });
                      }}
                      type={historyFilter?.mode === "monthly" ? "month" : "date"}
                    />
                  )}

                  {historyFilter?.mode === "period" && (
                    <Input
                      className="block w-full md:w-[14rem] lg:w-[10rem]"
                      value={historyFilter?.end_date_time}
                      onChange={(e) => setHistoryFilter({ ...historyFilter, end_date_time: e.target.value })}
                      type="date"
                      min={historyFilter?.start_date_time}
                    />
                  )}
                </div>

                <SelectForm
                  options={processList?.map((info) => ({
                    label: info?.process_name,
                    value: info?.process_id,
                  }))}
                  className="w-full md:w-[14rem]"
                  value={historyFilter?.process_id}
                  onChange={(e) => {
                    setHistoryFilter({
                      ...historyFilter,
                      process_id: e.target.value,
                    });
                  }}
                />

                <SelectForm
                  options={[
                    {
                      label: "กะเช้า / Day",
                      value: "DAY",
                    },
                    {
                      label: "กะดึก / Night",
                      value: "NIGHT",
                    },
                  ]}
                  className="w-full md:w-[14rem]"
                  value={historyFilter?.shift}
                  onChange={(e) => {
                    setHistoryFilter({
                      ...historyFilter,
                      shift: e.target.value as "DAY" | "NIGHT",
                    });
                  }}
                />

                <Button
                  onClick={() => {
                    const exportData = productivityMapped;
                    excelHelper.downloadExcelData(exportData, "defects");
                  }}
                  className="w-full md:w-max"
                >
                  Excel Export
                </Button>
              </div>

              {isPendingRawProductivitys ? (
                <div className="flex h-full flex-col items-center justify-center gap-1">
                  <Spinner />
                  <p className="ml-2">Loading...</p>
                </div>
              ) : (
                <div className="flex h-0 w-full flex-grow flex-col overflow-y-auto rounded-md border">
                  <Table className="relative h-full w-full border-collapse">
                    <TableHeader className="sticky top-0 z-10 bg-secondary">
                      <TableRow className="whitespace-nowrap">
                        {HEADER_PRODUCTIVITY2?.map((header, __index) => (
                          <TableHead
                            key={`${header.label}-${__index}`}
                            className={cn(
                              "whitespace-nowrap",
                              !isNaN(productivityMapped?.[0]?.[header.key as keyof TProductivity] as number) &&
                                "text-right"
                            )}
                          >
                            {header.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mapData()?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={HEADER.length}>No data available</TableCell>
                        </TableRow>
                      )}
                      {mapData()?.map((defect, __defect_index) => (
                        <TableRow className="whitespace-nowrap" key={`${__defect_index}`}>
                          {HEADER_PRODUCTIVITY2?.map((header, header_index) => (
                            <TableCell
                              className={cn(
                                "whitespace-nowrap",
                                !isNaN(defect?.[header.key as keyof TMapData] as number) && "text-right"
                              )}
                              key={`${header_index}`}
                            >
                              {typeof defect?.[header?.key as keyof TMapData] === "function" && defect
                                ? ""
                                : defect && defect?.[header?.key as keyof TMapData]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell>Total Summary</TableCell>
                        {historyFilter.shift === "DAY" ? (
                          <>
                            <TableCell className="text-right">{summaryMapDataMapped("08:00 - 09:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("09:00 - 10:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("10:00 - 11:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("11:00 - 12:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("12:00 - 13:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("13:00 - 14:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("14:00 - 15:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("15:00 - 16:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("16:00 - 17:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("17:00 - 18:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("18:00 - 19:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("19:00 - 20:00")}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="text-right">{summaryMapDataMapped("20:00 - 21:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("21:00 - 22:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("22:00 - 23:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("23:00 - 24:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("24:00 - 01:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("01:00 - 02:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("02:00 - 03:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("03:00 - 04:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("04:00 - 05:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("05:00 - 06:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("06:00 - 07:00")}</TableCell>
                            <TableCell className="text-right">{summaryMapDataMapped("07:00 - 08:00")}</TableCell>
                          </>
                        )}

                        <TableCell colSpan={8}></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="hidden h-full">
            <div className="flex h-full flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <SelectForm
                  options={[
                    {
                      label: "รายวัน / Daily",
                      value: "daily",
                    },
                    {
                      label: "ช่วงวัน / Period",
                      value: "period",
                    },
                    {
                      label: "สัปดาห์ / Week",
                      value: "week",
                    },
                    {
                      label: "รายเดือน / Monthly",
                      value: "monthly",
                    },
                  ]}
                  className="w-full md:w-[14rem]"
                  value={historyFilter?.mode}
                  onChange={(e) => {
                    setHistoryFilter({
                      ...historyFilter,
                      mode: e.target.value,
                      end_date_time: e.target.value === "period" ? historyFilter?.start_date_time : "",
                    });
                  }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  {historyFilter?.mode === "week" && (
                    <Input
                      onChange={(e) => {
                        const value = e.target.value;
                        const [year, week] = value.split("-W");
                        const YEAR = parseInt(year);
                        const WEEK = parseInt(week);
                        const { startDate: start_date, endDate: end_date } = getStartDateEndDateOfWeek(WEEK, YEAR);
                        setHistoryFilter({
                          ...historyFilter,
                          start_date_time: renderFormattedPayloadDate(new Date(start_date)) ?? "",
                          end_date_time: renderFormattedPayloadDate(new Date(end_date)) ?? "",
                        });
                      }}
                      value={getWeekString(new Date(historyFilter?.start_date_time))}
                      className="block w-full md:w-[14rem] lg:w-[10rem]"
                      type="week"
                    />
                  )}

                  {(historyFilter?.mode === "daily" ||
                    historyFilter?.mode === "period" ||
                    historyFilter?.mode === "monthly") && (
                    <Input
                      className="block w-full md:w-[14rem] lg:w-[10rem]"
                      value={historyFilter?.start_date_time?.slice(0, historyFilter?.mode === "monthly" ? 7 : 10)}
                      onChange={(e) => {
                        const start_date_time = e.target.value + (historyFilter?.mode === "monthly" ? "-01" : "");
                        let end_date_time = historyFilter?.end_date_time;

                        if (historyFilter?.mode === "monthly") {
                          const [year, month] = start_date_time.split("-");
                          const endOfMonth = new Date(Number(year), Number(month), 0);
                          end_date_time = `${year}-${month}-${endOfMonth.getDate()}`;
                        }

                        setHistoryFilter({
                          ...historyFilter,
                          start_date_time,
                          end_date_time,
                        });
                      }}
                      type={historyFilter?.mode === "monthly" ? "month" : "date"}
                    />
                  )}

                  {historyFilter?.mode === "period" && (
                    <Input
                      className="block w-full md:w-[14rem] lg:w-[10rem]"
                      value={historyFilter?.end_date_time}
                      onChange={(e) => setHistoryFilter({ ...historyFilter, end_date_time: e.target.value })}
                      type="date"
                      min={historyFilter?.start_date_time}
                    />
                  )}
                </div>
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
                              process_id: [],
                            })
                          }
                          className="text-xs text-red-500 hover:underline"
                        >
                          Reset
                        </button>
                      </div>
                      <div className="flex flex-col">
                        {processList?.map((process, _index) => (
                          <div className="flex items-center gap-2" key={_index}>
                            <Checkbox
                              id={process?.process_name}
                              name={process?.process_name}
                              checked={allFilter?.process_id?.includes(process?.process_id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setAllFilter({
                                    ...allFilter,
                                    process_id: [...allFilter?.process_id, process?.process_id],
                                  });
                                } else {
                                  setAllFilter({
                                    ...allFilter,
                                    process_id: allFilter?.process_id?.filter((item) => item !== process?.process_id),
                                  });
                                }
                              }}
                            />
                            <label htmlFor={process?.process_id} className="text-sm">
                              {process?.process_name}
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
                    const exportData = productivityMapped;
                    excelHelper.downloadExcelData(exportData, "defects");
                  }}
                  className="w-full md:w-max"
                >
                  Excel Export
                </Button>
              </div>
              {isPendingRawProductivitys ? (
                <div className="flex h-full flex-col items-center justify-center gap-1">
                  <Spinner />
                  <p className="ml-2">Loading...</p>
                </div>
              ) : (
                <div className="flex h-0 w-full flex-grow flex-col overflow-y-auto rounded-md border">
                  <Table className="relative h-full w-full border-collapse">
                    <TableHeader className="sticky top-0 z-10 bg-secondary">
                      <TableRow className="whitespace-nowrap">
                        {HEADER_PRODUCTIVITY?.map((header, __index) => (
                          <TableHead
                            key={`${header.label}-${__index}`}
                            className={cn(
                              "whitespace-nowrap",
                              !isNaN(productivityMapped?.[0]?.[header.key as keyof TProductivity] as number) &&
                                "text-right"
                            )}
                          >
                            {header.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productivityMapped?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={HEADER.length}>No data available</TableCell>
                        </TableRow>
                      )}
                      {productivityMapped?.map((defect, __defect_index) => (
                        <TableRow className="whitespace-nowrap" key={`${defect?.prod_log_id}-${__defect_index}`}>
                          {HEADER_PRODUCTIVITY?.map((header, header_index) => (
                            <TableCell
                              className={cn(
                                "whitespace-nowrap",
                                !isNaN(defect?.[header.key as keyof TProductivity] as number) && "text-right"
                              )}
                              key={`${defect?.prod_log_id}-${header_index}`}
                            >
                              {typeof defect?.[header?.key as keyof TProductivity] === "function" && defect
                                ? defect?.action()
                                : defect && defect?.[header?.key as keyof TProductivity]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={historyFilter?.mode == "daily" ? 6 : 7}>Total Summary</TableCell>
                        <TableCell className="text-right">{summaryProductivityMapped("ng_quantity")}</TableCell>
                        <TableCell className="text-right">{summaryProductivityMapped("quantity")}</TableCell>
                        <TableCell colSpan={8}></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

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
                      label: "ช่วงวัน / Period",
                      value: "period",
                    },
                    {
                      label: "สัปดาห์ / Week",
                      value: "week",
                    },
                    {
                      label: "รายเดือน / Monthly",
                      value: "monthly",
                    },
                  ]}
                  className="w-full md:w-[14rem]"
                  value={historyFilter?.mode}
                  onChange={(e) => {
                    setHistoryFilter({
                      ...historyFilter,
                      mode: e.target.value,
                      end_date_time: e.target.value === "period" ? historyFilter?.start_date_time : "",
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
                              process_id: [],
                            })
                          }
                          className="text-xs text-red-500 hover:underline"
                        >
                          Reset
                        </button>
                      </div>
                      <div className="flex flex-col">
                        {processList?.map((process, _index) => (
                          <div className="flex items-center gap-2" key={_index}>
                            <Checkbox
                              id={process?.process_name}
                              name={process?.process_name}
                              checked={allFilter?.process_id?.includes(process?.process_id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setAllFilter({
                                    ...allFilter,
                                    process_id: [...allFilter?.process_id, process?.process_id],
                                  });
                                } else {
                                  setAllFilter({
                                    ...allFilter,
                                    process_id: allFilter?.process_id?.filter((item) => item !== process?.process_id),
                                  });
                                }
                              }}
                            />
                            <label htmlFor={process?.process_id} className="text-sm">
                              {process?.process_name}
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
                process_id: selectedDefect?.process_id || "",
                part_id: selectedDefect?.part_id || "",
                case_id: selectedDefect?.case_id || "",
                ng_quantity: selectedDefect?.ng_quantity || null,
                machine_id: selectedDefect?.machine_id || "",
                rework_quantity: selectedDefect?.rework_quantity || null,
                // rework_cost_per_unit: selectedDefect?.rework_cost_per_unit || "",
                scrap_quantity: selectedDefect?.scrap_quantity || null,
                // scrap_cost_per_unit: selectedDefect?.scrap_cost_per_unit || null,
                image: selectedDefect?.image || "",
                remarks: selectedDefect?.remarks || "",
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer
        open={isOpenProductivityEdit}
        onClose={() => setIsOpenProductivityEdit(false)}
        onOpenChange={(open) => setIsOpenProductivityEdit(open)}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>แก้ไขข้อมูล / Edit Productivity</DrawerTitle>
            <DrawerDescription>แก้ไขข้อมูลการบันทึกยอดการผลิต / Edit productivity information</DrawerDescription>
          </DrawerHeader>
          <div className="flex max-h-[60dvh] flex-col gap-4 overflow-y-auto p-4">
            <CreateUpdateProductivity
              onClose={() => setIsOpenProductivityEdit(false)}
              isTitleVisible={false}
              data={{
                ...selectedProductivity,
                prod_log_id: selectedProductivity?.prod_log_id,
                datetime: "",
                date: renderFormattedPayloadDate(selectedDefect?.datetime) ?? "",
                time_slot: getTimeSlotByDateTimestamp(new Date(selectedDefect?.datetime ?? "")?.getTime())?.value,
                process_id: selectedDefect?.process_id || "",
                part_id: selectedDefect?.part_id || "",
                quantity: selectedDefect?.ng_quantity || 0,
                machine_id: selectedDefect?.machine_id || "",
                remarks: selectedDefect?.remarks || "",
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
