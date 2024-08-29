import { PageHeader } from "@/components/common/page-header";
import { CreateUpdateAccount } from "@/components/form";
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
import { cn } from "@/lib/utils";
import { useAccount } from "@/services/hooks/use-account";
import { FC, useState } from "react";

export const AccountSettingPage: FC = () => {
  const { mutateDeleteAccount } = useAccount();
  const [search, setSearch] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const HEADER = [
    {
      label: "No.",
      key: "no",
    },
    {
      label: "ชื่อ - นามสกุล / Name - Surname",
      key: "name",
    },
    {
      label: "หมายเหตุ / Remark",
      key: "remark",
    },
    {
      label: "Action",
      key: "action",
    },
  ];

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <Dialog
        open={isDialogOpen}
        onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มชื่อ / Add name</DialogTitle>
            <DialogDescription>กรุณากรอกชื่อ Operator ที่ต้องการเพิ่ม</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <CreateUpdateAccount />
          </div>
        </DialogContent>
      </Dialog>
      <main className="flex h-full w-full flex-col gap-2">
        <PageHeader title="ตั้งค่า Operator name / Operator name setting" description="ตั้งค่าชื่อ Operator " />
        <div className="flex w-full justify-between">
          <Input placeholder="ค้นหา" className="w-1/3" onChange={(e) => setSearch(e.target.value)} value={search} />
          <Button onClick={() => setIsDialogOpen(true)}>เพิ่มชื่อ / Add name</Button>
        </div>
        <div>
          <Table className="relative h-full w-full border-collapse">
            <TableHeader className="sticky top-0 z-10 bg-secondary">
              <TableRow className="whitespace-nowrap">
                {HEADER?.map((header) => (
                  <TableHead key={header.label} className={cn("whitespace-nowrap")}>
                    {header.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {new Array(10).fill(0).map((_, index) => (
                <TableRow key={index} className="whitespace-nowrap">
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>นาย สมชาย ใจดี</TableCell>
                  <TableCell>Operator ที่ใช้งานระบบ</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button className="text-blue-500 hover:underline">Edit</button>
                      <AlertDialog>
                        <AlertDialogTrigger className="text-red-500">Delete</AlertDialogTrigger>
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
                                await mutateDeleteAccount("delete");
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
    </div>
  );
};
