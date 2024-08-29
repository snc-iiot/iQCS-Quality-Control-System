import { PageHeader } from "@/components/common/page-header";
import { CreateUpdateProcess } from "@/components/form";
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
import { useProcess } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TProcess } from "@/types";
import { FC, useState } from "react";

const HEADER = [
  "No.",
  "Process Color",
  "Process Name",
  "Process Description",
  "Created Date",
  "Updated Date",
  "Created By",
  "Action",
];

export const ProcessPage: FC = () => {
  const { processList } = useAtomStore();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState<boolean>(false);

  const [selectedProcess, setSelectedProcess] = useState<TProcess | null>(null);

  const [search, setSearch] = useState<string>("");

  const filteredProcess = processList?.filter(
    (process) => process?.process_name?.toLowerCase().includes(search.toLowerCase())
  );

  const { mutateDeleteProcess } = useProcess();

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <main className="flex h-full w-full flex-col gap-2">
        <div className="flex flex-col gap-2 md:flex-row">
          <PageHeader
            title="ตั้งค่ากระบวนการผลิต / Process setting"
            description="ตั้งค่ากระบวนการผลิต และ สามารถเพิ่ม ลบ แก้ไข"
          />
          <div className="flex w-full justify-end gap-2">
            <Input
              placeholder="ค้นหา"
              className="w-full md:w-1/4"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <Button className="whitespace-nowrap" onClick={() => setIsDialogOpen(true)}>
              Add Process
            </Button>
          </div>
        </div>
        <div className="flex h-full w-full flex-col overflow-y-auto rounded-md border">
          <div className="flex h-full flex-col">
            <div className="flex h-0 grow flex-col">
              <Table className="relative h-full w-full border-collapse">
                <TableHeader className="sticky top-0 z-10 bg-secondary">
                  <TableRow>
                    {HEADER.map((header) => (
                      <TableHead className="whitespace-nowrap text-sm" key={header}>
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProcess?.length == 0 && (
                    <TableRow>
                      <TableCell className="text-center" colSpan={HEADER.length}>
                        No data variable
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredProcess?.map((process, index) => (
                    <TableRow className="whitespace-nowrap" key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="h-6 w-6 rounded-full" style={{ backgroundColor: process?.process_color }} />
                      </TableCell>
                      <TableCell>{process?.process_name}</TableCell>
                      <TableCell>{process?.process_description || "-"}</TableCell>
                      <TableCell>{renderFormattedDateWithTime(new Date(process?.created_at))}</TableCell>
                      <TableCell>{renderFormattedDateWithTime(new Date(process?.updated_at))}</TableCell>
                      <TableCell>User Name</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedProcess(process);
                              setIsDialogUpdateOpen(true);
                            }}
                            className="text-blue-500"
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
                                    const res = await mutateDeleteProcess(process?.process_id);
                                    console.log(res);
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
          </div>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่ม Process / Add Process</DialogTitle>
            <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
          </DialogHeader>

          <CreateUpdateProcess onClose={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogUpdateOpen} onOpenChange={setIsDialogUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไข Process / Edit Process</DialogTitle>
            <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
          </DialogHeader>

          <CreateUpdateProcess
            data={{
              process_id: selectedProcess?.process_id,
              process_name: selectedProcess?.process_name,
              process_description: selectedProcess?.process_description || "",
            }}
            onClose={() => {
              setIsDialogUpdateOpen(false);
              setSelectedProcess(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
