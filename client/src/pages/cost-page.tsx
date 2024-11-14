import { PageHeader } from "@/components/common/page-header";
import { CreateUpdatePriceRatio } from "@/components/form";
import { WithAdminHOC } from "@/components/hoc";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { renderFormattedDate, renderFormattedDateWithTime } from "@/helpers/date-time.helper";
import { usePriceRatio } from "@/services/hooks/use-price-ratio";
import { useAtomStore } from "@/store";
import { TCreateUpdatePriceRatio } from "@/types";
import { FC, useState } from "react";

export const CostPage: FC = () => {
  const [search, setSearch] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { priceRatioList } = useAtomStore();
  const { mutateDeletePriceRatio } = usePriceRatio();
  const [ratioSelected, setRatioSelected] = useState<TCreateUpdatePriceRatio | null>(null);

  const HEADER = [
    "No.",
    "วันที่เริ่มมีผล / Effective date",
    "อัตราส่วน ค่าใช้จ่าย NG / NG cost ratio",
    "อัตราส่วน ค่าใช้จ่าย Scrap / Scrap cost ratio",
    "อัตราส่วน ค่าใช้จ่าย Rework / Rework cost ratio",
    "หมายเหตุ / Remarks",
    "วันที่สร้าง / Created date",
    "วันที่แก้ไข / Updated date",
    "Action",
  ];

  const filteredPriceRatioList = priceRatioList.filter((item) => {
    return item.effective_date.includes(search);
  });

  const ActionWithAuth = WithAdminHOC(() => <AlertDialogTrigger className="text-red-500">Delete</AlertDialogTrigger>);

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <main className="flex h-full w-full flex-col gap-2">
        <PageHeader title="ตั้งค่า อัตราส่วน ค่าใช้จ่าย / Cost ratio setting" />
        <div className="flex w-full justify-between">
          <Input placeholder="ค้นหา" className="w-1/3" onChange={(e) => setSearch(e.target.value)} value={search} />
          <Button onClick={() => setIsDialogOpen(true)}>Add cost ratio</Button>
        </div>
        <div>
          <Table className="relative h-full w-full border-collapse">
            <TableHeader className="sticky top-0 z-10 bg-secondary">
              <TableRow className="whitespace-nowrap">
                {HEADER?.map((header) => (
                  <TableHead key={header} className="whitespace-nowrap">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPriceRatioList?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={HEADER.length} className="text-center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
              {filteredPriceRatioList?.map((priceRatio, priceRatio_index) => (
                <TableRow key={priceRatio_index} className="whitespace-nowrap">
                  <TableCell>{priceRatio_index + 1}</TableCell>
                  <TableCell>{renderFormattedDate(new Date(priceRatio?.effective_date))}</TableCell>
                  <TableCell className="text-right">{priceRatio?.ng_ratio}</TableCell>
                  <TableCell className="text-right">{priceRatio?.scrap_ratio}</TableCell>
                  <TableCell className="text-right">{priceRatio?.rework_ratio}</TableCell>
                  <TableCell>{priceRatio?.remarks}</TableCell>
                  <TableCell>{renderFormattedDateWithTime(new Date(priceRatio?.created_at))}</TableCell>
                  <TableCell>{renderFormattedDateWithTime(new Date(priceRatio?.updated_at))}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => {
                          setRatioSelected({
                            ratio_id: priceRatio?.ratio_id,
                            effective_date: priceRatio?.effective_date,
                            ng_ratio: parseFloat(priceRatio?.ng_ratio),
                            scrap_ratio: parseFloat(priceRatio?.scrap_ratio),
                            rework_ratio: parseFloat(priceRatio?.rework_ratio),
                            remarks: priceRatio?.remarks,
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        More Detail
                      </button>
                      <AlertDialog>
                        <ActionWithAuth />
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>คุณต้องการลบข้อมูลหรือไม่? / Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              การกระทำนี้ไม่สามารถย้อนกลับได้ / This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>ยกเลิก / Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                await mutateDeletePriceRatio(priceRatio?.ratio_id);
                              }}
                            >
                              ลบ / Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent className="max-h-[80%] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {ratioSelected
                ? `รายละเอียด อัตราส่วน ค่าใช้จ่าย / Detail cost ratio`
                : "เพิ่ม อัตราส่วน ค่าใช้จ่าย / Add cost ratio"}
            </DialogTitle>
            <DialogDescription>
              {ratioSelected
                ? "โปรดตรวจสอบข้อมูลอีกครั้ง / Please check the information again"
                : "โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in the information completely"}
            </DialogDescription>
          </DialogHeader>
          {ratioSelected ? (
            <CreateUpdatePriceRatio
              data={ratioSelected}
              onClose={() => {
                setIsDialogOpen(false);
                setRatioSelected(null);
              }}
              isPreview
            />
          ) : (
            <CreateUpdatePriceRatio
              onClose={() => {
                setIsDialogOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
