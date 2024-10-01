import { PageHeader } from "@/components/common/page-header";
import { CreateUpdateModel } from "@/components/form";
import { WithAdminHOC, WithUserHOC } from "@/components/hoc";
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
import { useAtomStore } from "@/store";
import { TModel } from "@/types";
import { FC, useState } from "react";

const useFilterModel = (modelList: TModel[], search: string) => {
  return modelList?.filter((item) => item?.model_name?.toLowerCase()?.includes(search.toLowerCase()));
};

export const ModelPage: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<TModel | null>(null);

  const { modelList } = useAtomStore();

  const HEADER = [
    "No.",
    "ชื่อโมเดล / Model name",
    "รายละเอียด / Description",
    "วันที่สร้าง / Created date",
    "วันที่แก้ไข / Updated date",
    "จัดการ / Action",
  ];

  const ActionWithAuth = WithAdminHOC(() => <AlertDialogTrigger className="text-red-500">Delete</AlertDialogTrigger>);
  const ActionWithUser: FC<{ model: TModel }> = WithUserHOC((props) => {
    const { model } = props as { model: TModel };
    return (
      <button
        className="text-yellow-500 hover:underline"
        onClick={() => {
          setSelectedModel(model);
          setIsEdit(true);
        }}
      >
        Edit
      </button>
    );
  });

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[80%] min-h-max overflow-auto">
          <DialogHeader>
            <DialogTitle>โมเดล / Model</DialogTitle>
            <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-scroll p-1">
            <CreateUpdateModel onClose={() => setIsModalOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isEdit} onOpenChange={setIsEdit}>
        <DialogContent className="max-h-[80%] min-h-max overflow-auto">
          <DialogHeader>
            <DialogTitle>แก้ไขโมเดล / Model</DialogTitle>
            <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-scroll p-1">
            <CreateUpdateModel onClose={() => setIsEdit(false)} data={selectedModel} />
          </div>
        </DialogContent>
      </Dialog>
      <main className="flex h-full w-full flex-col gap-2">
        <div className="flex flex-col gap-2 md:flex-row">
          <PageHeader title="ตั้งค่าโมเดล / Model setting" description="ตั้งค่าโมเดล และ สามารถเพิ่ม ลบ แก้ไข" />
        </div>
        <div className="flex w-full justify-between gap-2">
          <Input
            placeholder="ค้นหาโมเดล"
            className="w-full md:w-1/4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => setIsModalOpen(true)}>Add Model</Button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary">
                {HEADER?.map((item, index) => <TableHead key={index}>{item}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {useFilterModel(modelList, search)?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={HEADER.length} className="text-center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
              {useFilterModel(modelList, search)?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item?.model_name}</TableCell>
                  <TableCell>{item?.model_description ?? "-"}</TableCell>
                  <TableCell>{renderFormattedDateWithTime(new Date(item?.created_at))}</TableCell>
                  <TableCell>{renderFormattedDateWithTime(new Date(item?.updated_at))}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <ActionWithUser model={item} />
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
                            <AlertDialogAction>ลบ / Delete</AlertDialogAction>
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
