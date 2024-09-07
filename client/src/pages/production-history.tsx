import { CreateUpdateProductivity } from "@/components/form";
import { LoggingTabs, ProductionOptionFilter, TValueProductionOptionFilter } from "@/components/history";
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
import { ExcelHelper } from "@/helpers/excel.helper";
import { DEFECT_HEADER, getRequiredRawDefects, MapDataProductivity } from "@/helpers/history-production.helper";
import { cn } from "@/lib/utils";
import { useProductivity } from "@/services/hooks/use-productivity";
import { useAtomStore } from "@/store";
import { TMapDataProductivity, TProductivity } from "@/types";
import { FC, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ProductionHistory: FC = () => {
  const excelHelper = new ExcelHelper();
  const { productivityList, processList } = useAtomStore();
  const { useGetRawProductivitys, mutateDeleteProductivity } = useProductivity();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [, setIsOpenProductivityDetail] = useState<boolean>(false);
  const [isOpenProductivityEdit, setIsOpenProductivityEdit] = useState<boolean>(false);
  const [selectedProductivity, setSelectedProductivity] = useState<TProductivity | null>(null);

  const [values, setValues] = useState<TValueProductionOptionFilter>({
    mode: "daily",
    shift: "DAY",
    process_id: processList[0]?.process_id,
    start_date: renderFormattedPayloadDate(new Date()) ?? "",
    end_date: renderFormattedPayloadDate(new Date()) ?? "",
    filters: {
      process_id: [],
      shift: [],
    },
  });
  const { start_date_time, end_date_time } = getRequiredRawDefects(values);
  const { refetch, isPending: isPendingRawDefects } = useGetRawProductivitys(start_date_time, end_date_time);

  const productivityMapped = useMemo(
    () =>
      productivityList
        ?.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
        ?.filter((productivity) => {
          if (values?.filters?.process_id?.length === 0) {
            return true;
          }
          return values?.filters?.process_id?.includes(productivity.process_id);
        })
        ?.filter((productivity) => {
          if (values?.filters?.shift?.length === 0) {
            return true;
          }
          return values?.filters?.shift?.includes(productivity.shift);
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
                className="text-yellow-500 hover:underline"
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
    [productivityList, values?.filters]
  );

  const HEADER = DEFECT_HEADER(values);

  const summary = (key: keyof TMapDataProductivity): number => {
    return (
      MapDataProductivity(values, productivityMapped)?.reduce((acc, curr) => {
        const value = curr[key];
        const numericValue = typeof value === "number" ? value : 0;
        return acc + (isNaN(numericValue) ? 0 : numericValue);
      }, 0) ?? 0
    );
  };

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
        <ProductionOptionFilter
          values={values}
          setValues={setValues}
          Export={() => {
            const exportData = productivityMapped;
            excelHelper.downloadExcelData(
              exportData,
              `iQCS-Export_data_productivity_(${values?.start_date}-${values?.end_date})`
            );
          }}
        />
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
                      className={cn("whitespace-nowrap", __index !== 0 && "text-right")}
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
                {MapDataProductivity(values, productivityMapped)?.map((defect, __defect_index) => (
                  <TableRow className="whitespace-nowrap" key={`${__defect_index}`}>
                    {DEFECT_HEADER(values)?.map((header, header_index) => (
                      <TableCell
                        className={cn("whitespace-nowrap", header_index !== 0 && "text-right")}
                        key={`${header_index}`}
                      >
                        {typeof defect?.[header?.key as keyof TMapDataProductivity] === "function" && defect
                          ? 0
                          : (defect && defect?.[header?.key as keyof TMapDataProductivity]) ?? 0}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Total Summary</TableCell>
                  {values?.shift === "DAY" ? (
                    <>
                      <TableCell className="text-right">{summary("08:00 - 09:00")}</TableCell>
                      <TableCell className="text-right">{summary("09:00 - 10:00")}</TableCell>
                      <TableCell className="text-right">{summary("10:00 - 11:00")}</TableCell>
                      <TableCell className="text-right">{summary("11:00 - 12:00")}</TableCell>
                      <TableCell className="text-right">{summary("12:00 - 13:00")}</TableCell>
                      <TableCell className="text-right">{summary("13:00 - 14:00")}</TableCell>
                      <TableCell className="text-right">{summary("14:00 - 15:00")}</TableCell>
                      <TableCell className="text-right">{summary("15:00 - 16:00")}</TableCell>
                      <TableCell className="text-right">{summary("16:00 - 17:00")}</TableCell>
                      <TableCell className="text-right">{summary("17:00 - 18:00")}</TableCell>
                      <TableCell className="text-right">{summary("18:00 - 19:00")}</TableCell>
                      <TableCell className="text-right">{summary("19:00 - 20:00")}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="text-right">{summary("20:00 - 21:00")}</TableCell>
                      <TableCell className="text-right">{summary("21:00 - 22:00")}</TableCell>
                      <TableCell className="text-right">{summary("22:00 - 23:00")}</TableCell>
                      <TableCell className="text-right">{summary("23:00 - 24:00")}</TableCell>
                      <TableCell className="text-right">{summary("24:00 - 01:00")}</TableCell>
                      <TableCell className="text-right">{summary("01:00 - 02:00")}</TableCell>
                      <TableCell className="text-right">{summary("02:00 - 03:00")}</TableCell>
                      <TableCell className="text-right">{summary("03:00 - 04:00")}</TableCell>
                      <TableCell className="text-right">{summary("04:00 - 05:00")}</TableCell>
                      <TableCell className="text-right">{summary("05:00 - 06:00")}</TableCell>
                      <TableCell className="text-right">{summary("06:00 - 07:00")}</TableCell>
                      <TableCell className="text-right">{summary("07:00 - 08:00")}</TableCell>
                    </>
                  )}
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </div>
      {/* <DefectDetail
        defect={selectedDefect as TDefect}
        isOpen={isOpenDefectDetail}
        onClose={() => setIsOpenDefectDetail(false)}
      /> */}

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
                date: renderFormattedPayloadDate(selectedProductivity?.datetime) ?? "",
                time_slot: getTimeSlotByDateTimestamp(new Date(selectedProductivity?.datetime ?? "")?.getTime())?.value,
                process_id: selectedProductivity?.process_id || "",
                part_id: selectedProductivity?.part_id || "",
                quantity: selectedProductivity?.ng_quantity || 0,
                machine_id: selectedProductivity?.machine_id || "",
                remarks: selectedProductivity?.remarks || "",
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
