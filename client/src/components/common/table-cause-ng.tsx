import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SettingNGForm } from "../form/setting-ng-form";

export const TableCauseNg = () => {
  return (
    <div className="flex h-full w-full flex-col gap-2 px-4">
      <div className=" w-full text-right">
        <Dialog>
          <DialogTrigger>
            <Button variant="outline">เพิ่มข้อมูล</Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>สร้างข้อมูลของเสีย / Create NG Data</DialogTitle>
              <DialogDescription>
                <SettingNGForm />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="whitespace-nowrap">
            <TableHead className="whitespace-nowrap">No.</TableHead>
            <TableHead className="whitespace-nowrap">กระบวนการผลิต / Process</TableHead>
            <TableHead>อาการของเสีย / Symptom of NG</TableHead>
            <TableHead className="text w-[100px] whitespace-nowrap">รายละเอียด / Description</TableHead>
            <TableHead className="text whitespace-nowrap">วันที่สร้าง / Created Date</TableHead>
            <TableHead className="text whitespace-nowrap">วันที่แก้ไข / Updated Date</TableHead>
            <TableHead className="text whitespace-nowrap">จัดการ / Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>Spot</TableCell>
            <TableCell>บุบ งอ</TableCell>
            <TableCell className="text">ชิ้นงานมีรอยบุบ งอ</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
