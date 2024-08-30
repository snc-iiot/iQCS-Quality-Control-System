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
import { renderFormattedDateWithTime } from "@/helpers/date-time.helper";
import { useMachine } from "@/services/hooks/use-machine";
import { useAtomStore } from "@/store";
import { TCreateUpdateMachine } from "@/types";
import { FC, useState } from "react";

export const SettingMachinePage: FC = () => {
  const { mutateDeleteMachine } = useMachine();
  const [search, setSearch] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const { machineList } = useAtomStore();
  const [updateMachine, setUpdateMachine] = useState<TCreateUpdateMachine | null>(null);

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
      label: "สถานที่ตั้ง / Location",
      key: "location",
    },
    {
      label: "วันที่สร้าง / Created date",
      key: "created_date",
    },
    {
      label: "วันที่แก้ไข / Updated date",
      key: "updated_date",
    },
    {
      label: "Action",
      key: "action",
    },
  ];

  const filteredMachineList = machineList?.filter((machine) => {
    return (
      machine.machine_name?.toLowerCase()?.includes(search?.toLowerCase()) ||
      machine.machine_no?.toLowerCase()?.includes(search?.toLowerCase()) ||
      machine.location?.toLowerCase()?.includes(search?.toLowerCase()) ||
      machine.description?.toLowerCase()?.includes(search?.toLowerCase())
    );
  });

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
      <Dialog
        open={isUpdateDialogOpen}
        onOpenChange={(isOpen) => {
          setIsUpdateDialogOpen(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขเครื่องจักร / Edit machine</DialogTitle>
            <DialogDescription>กรุณากรอกชื่อเครื่องจักร และหมายเลขเครื่องจักรที่ต้องการแก้ไข</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <CreateUpdateMachine
              data={
                {
                  machine_id: updateMachine?.machine_id,
                  machine_name: updateMachine?.machine_name,
                  machine_no: updateMachine?.machine_no,
                  description: updateMachine?.description,
                  location: updateMachine?.location,
                } as TCreateUpdateMachine
              }
              onClose={() => setIsUpdateDialogOpen(false)}
            />
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
              <TableRow>{HEADER?.map((item) => <TableHead key={item.key}>{item?.label}</TableHead>)}</TableRow>
            </TableHeader>
            <TableBody>
              {filteredMachineList?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    ไม่พบข้อมูล / No data
                  </TableCell>
                </TableRow>
              )}
              {filteredMachineList?.map((machine, machine_index) => (
                <TableRow key={machine_index}>
                  <TableCell>{machine_index + 1}</TableCell>
                  <TableCell>{machine?.machine_name}</TableCell>
                  <TableCell>{machine?.machine_no ?? "-"}</TableCell>
                  <TableCell>{machine?.location ?? "-"}</TableCell>
                  <TableCell>{renderFormattedDateWithTime(new Date(machine?.created_at))}</TableCell>
                  <TableCell>{renderFormattedDateWithTime(new Date(machine?.updated_at))}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => {
                          setUpdateMachine({
                            machine_id: machine.machine_id,
                            machine_name: machine.machine_name,
                            machine_no: machine.machine_no,
                            description: machine.description,
                            location: machine.location,
                          });
                          setIsUpdateDialogOpen(true);
                        }}
                      >
                        Edit
                      </button>
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
                                await mutateDeleteMachine(machine?.machine_id);
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
