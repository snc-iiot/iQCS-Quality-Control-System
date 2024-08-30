import { PageHeader } from "@/components/common/page-header";
import { CreateUpdateAccount } from "@/components/form";
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
import { renderFormattedDateWithTime } from "@/helpers/date-time.helper";
import { cn } from "@/lib/utils";
import { useAccount } from "@/services/hooks/use-account";
import { useAtomStore } from "@/store";
import { TCreateUpdateAccount } from "@/types";
import { FC, useState } from "react";

export const AccountSettingPage: FC = () => {
  const { mutateDeleteAccount } = useAccount();
  const [search, setSearch] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [accountSelected, setAccountSelected] = useState<TCreateUpdateAccount | null>(null);

  const { accountList } = useAtomStore();

  const HEADER = [
    {
      label: "No.",
      key: "no",
    },
    {
      label: "รหัสพนักงาน / Employee ID",
      key: "employee_id",
    },
    {
      label: "ชื่อ - นามสกุล / Name - Surname",
      key: "name",
    },
    {
      label: "ตำแหน่ง / Position",
      key: "position",
    },
    {
      label: "หน้าที่ / Responsibility",
      key: "responsibility",
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

  const filteredAccountList = accountList?.filter((account) => {
    return account.operator_name?.toLowerCase()?.includes(search?.toLowerCase());
  });

  const ActionWithAuth = WithAdminHOC(() => <AlertDialogTrigger className="text-red-500">Delete</AlertDialogTrigger>);

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
      <Dialog
        open={isEdit}
        onOpenChange={(isOpen) => {
          setIsEdit(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขชื่อ / Edit name</DialogTitle>
            <DialogDescription>กรุณากรอกชื่อ Operator ที่ต้องการแก้ไข</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <CreateUpdateAccount
              data={{
                operator_id: accountSelected?.operator_id,
                operator_name: accountSelected?.operator_name,
                employee_id: accountSelected?.employee_id,
                position: accountSelected?.position,
                responsibility: accountSelected?.responsibility,
                remarks: accountSelected?.remarks,
              }}
              onClose={() => setIsEdit(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isPreview}
        onOpenChange={(isOpen) => {
          setIsPreview(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ข้อมูล Operator / Operator Information</DialogTitle>
            <DialogDescription>
              รายละเอียดข้อมูล Operator ที่เลือก / Detail of Operator that you selected
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <CreateUpdateAccount
              data={{
                operator_id: accountSelected?.operator_id,
                operator_name: accountSelected?.operator_name,
                employee_id: accountSelected?.employee_id,
                position: accountSelected?.position,
                responsibility: accountSelected?.responsibility,
                remarks: accountSelected?.remarks,
              }}
              isPreview
              onClose={() => setIsPreview(false)}
            />
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
              {filteredAccountList?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={HEADER.length} className="text-center">
                    ไม่พบข้อมูล / No data found
                  </TableCell>
                </TableRow>
              )}
              {filteredAccountList?.map((operator, operators_index) => (
                <TableRow key={operators_index} className="whitespace-nowrap">
                  <TableCell>{operators_index + 1}</TableCell>
                  <TableCell>{operator?.employee_id ?? "-"}</TableCell>
                  <TableCell>{operator?.operator_name}</TableCell>
                  <TableCell>{operator?.position}</TableCell>
                  <TableCell>{operator?.responsibility}</TableCell>
                  <TableCell>
                    {operator?.created_at ? renderFormattedDateWithTime(new Date(operator?.created_at)) : "-"}
                  </TableCell>
                  <TableCell>
                    {operator?.updated_at ? renderFormattedDateWithTime(new Date(operator?.updated_at)) : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        className="hover:underline"
                        onClick={() => {
                          setAccountSelected({
                            operator_id: operator?.operator_id,
                            employee_id: operator?.employee_id,
                            operator_name: operator?.operator_name,
                            position: operator?.position,
                            responsibility: operator?.responsibility,
                            remarks: operator?.remarks,
                          });
                          setIsPreview(true);
                        }}
                      >
                        More Detail
                      </button>
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => {
                          setAccountSelected({
                            operator_id: operator?.operator_id,
                            employee_id: operator?.employee_id,
                            operator_name: operator?.operator_name,
                            position: operator?.position,
                            responsibility: operator?.responsibility,
                            remarks: operator?.remarks,
                          });
                          setIsEdit(true);
                        }}
                      >
                        Edit
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
