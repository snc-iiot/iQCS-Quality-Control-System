import { PageHeader } from "@/components/common/page-header";
import { CreateUpdatePart } from "@/components/form";
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
import { usePart } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TPart } from "@/types";
import { FC, useState } from "react";

const HEADER = [
  "No.",
  "Part No.",
  "Part Name",
  "Part Description",
  "Created Date",
  "Updated Date",
  "Created By",
  "Action",
];

export const PartPage: FC = () => {
  const { partList } = useAtomStore();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState<boolean>(false);

  const [selectedPart, setSelectedPart] = useState<TPart | null>(null);

  const [search, setSearch] = useState<string>("");

  const filteredPart = partList?.filter(
    (part) =>
      part?.part_code?.toLowerCase().includes(search.toLowerCase()) ||
      part?.part_name?.toLowerCase().includes(search.toLowerCase())
  );

  const { mutateDeletePart } = usePart();

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <main className="flex h-full w-full flex-col gap-2">
        <PageHeader
          title="ตั้งค่า Part ที่ใช้งาน / Setting Part"
          description="ตั้งค่า Part ที่ใช้งาน และ สามารถเพิ่ม ลบ แก้ไข"
        />
        <div className="flex w-full justify-between">
          <Input placeholder="ค้นหา" className="w-1/3" onChange={(e) => setSearch(e.target.value)} value={search} />
          <Button onClick={() => setIsDialogOpen(true)}>Add Part</Button>
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
                  {filteredPart?.length == 0 && (
                    <TableRow>
                      <TableCell className="text-center" colSpan={HEADER.length}>
                        No data variable
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredPart?.map((part, index) => (
                    <TableRow className="whitespace-nowrap" key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{part?.part_code}</TableCell>
                      <TableCell>{part?.part_name}</TableCell>
                      <TableCell>{part?.part_description || "-"}</TableCell>
                      <TableCell>{renderFormattedDateWithTime(new Date(part?.created_at))}</TableCell>
                      <TableCell>{renderFormattedDateWithTime(new Date(part?.updated_at))}</TableCell>
                      <TableCell>User Name</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedPart(part);
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
                                    const res = await mutateDeletePart(part?.part_code);
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
            <DialogTitle>เพิ่ม Part / Add Part</DialogTitle>
            <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
          </DialogHeader>
          <CreateUpdatePart onClose={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={isDialogUpdateOpen} onOpenChange={setIsDialogUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไข Part / Edit Part</DialogTitle>
            <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
          </DialogHeader>
          <CreateUpdatePart
            data={{
              part_code: selectedPart?.part_code,
              part_name: selectedPart?.part_name,
              part_description: selectedPart?.part_description || "",
            }}
            onClose={() => {
              setIsDialogUpdateOpen(false);
              setSelectedPart(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
