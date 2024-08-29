import { PageHeader } from "@/components/common/page-header";
import { CreateUpdateMachine } from "@/components/form";
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
import { useMachine } from "@/services/hooks/use-machine";
import { FC, useState } from "react";

export const SettingMachinePage: FC = () => {
  const { mutateDeleteMachine } = useMachine();
  const [search, setSearch] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const HEADER = [
    {
      label: "No.",
      key: "no",
    },
    {
      label: "ชื่อเครื่องจักร / Machine name",
      key: "machine_name",
    },
    {
      label: "หมายเลขเครื่องจักร / Machine no.",
      key: "machine_no",
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
            <DialogTitle>เพิ่มเครื่องจักร / Add machine</DialogTitle>
            <DialogDescription>กรุณากรอกชื่อเครื่องจักร และหมายเลขเครื่องจักรที่ต้องการเพิ่ม</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <CreateUpdateMachine />
          </div>
        </DialogContent>
      </Dialog>
      <main className="flex h-full w-full flex-col gap-2">
        <PageHeader title="ตั้งค่า เครื่องจักร / Machine setting" description="ตั้งค่าชื่อ Operator " />
        <div className="flex w-full justify-between">
          <Input placeholder="ค้นหา" className="w-1/3" onChange={(e) => setSearch(e.target.value)} value={search} />
          <Button onClick={() => setIsDialogOpen(true)}>เพิ่มเครื่องจักร / Add machine</Button>
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                {HEADER.map((item) => (
                  <TableHead key={item.key}>{item.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((item) => (
                <TableRow key={item}>
                  <TableCell>1</TableCell>
                  <TableCell>เครื่องจักร 1</TableCell>
                  <TableCell>123456</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button className="text-blue-500 hover:underline">Edit</button>
                      {/* <button className="text-red-500 hover:underline">Delete</button> */}
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
                                await mutateDeleteMachine("1");
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
