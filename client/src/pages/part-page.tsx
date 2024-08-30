import { PageHeader } from "@/components/common/page-header";
import { CreateUpdatePart } from "@/components/form";
import { ActionWithAdminHOC } from "@/components/hoc/action-with-admin";
import { CheckboxForm } from "@/components/ui-pattern/form-field/check-box-form";
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
import { Dropdown } from "@/components/ui/drop-down";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { renderFormattedDateWithTime } from "@/helpers/date-time.helper";
import { usePart } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TPart } from "@/types";
import { FC, useState } from "react";

const HEADER = [
  "No.",
  "Process.",
  "Part No.",
  "Part Name",
  "Part Price",
  "Part Description",
  "Created Date",
  "Updated Date",
  "Created By",
  "Action",
];

export const PartPage: FC = () => {
  const { partList, processList } = useAtomStore();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState<boolean>(false);
  const [fields, setFields] = useState<{ [key: string]: string[] }>({});

  const [selectedPart, setSelectedPart] = useState<TPart | null>(null);

  const [search, setSearch] = useState<string>("");

  const filteredPart = partList?.filter(
    (part) =>
      (part?.part_code?.toLowerCase().includes(search.toLowerCase()) ||
        part?.part_name?.toLowerCase().includes(search.toLowerCase()) ||
        part?.part_price?.toLowerCase().includes(search.toLowerCase())) &&
      (fields?.process?.includes(part?.process_name) || fields?.process?.length === 0)
  );

  const { mutateDeletePart } = usePart();

  const ActionWithAuth = ActionWithAdminHOC(() => (
    <AlertDialogTrigger className="text-red-500">Delete</AlertDialogTrigger>
  ));

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <main className="flex h-full w-full flex-col gap-2">
        <div className="flex flex-col gap-2 md:flex-row">
          <PageHeader
            title="ตั้งค่า Part ที่ใช้งาน / Setting Part"
            description="ตั้งค่า Part ที่ใช้งาน และ สามารถเพิ่ม ลบ แก้ไข"
          />
          <div className="flex w-full justify-end gap-2">
            <Input
              placeholder="ค้นหา"
              className="w-full md:w-1/4"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <Dropdown
              label="Field"
              content={
                <div className="px-2">
                  <CheckboxForm
                    label="Process name"
                    value={fields?.process}
                    onChange={(e) => setFields({ ...fields, process: e })}
                    options={processList?.map(({ process_name }) => ({
                      label: process_name,
                      value: process_name,
                    }))}
                  />
                </div>
              }
            />
            <Button className="whitespace-nowrap" onClick={() => setIsDialogOpen(true)}>
              Add Part
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
                      <TableCell>{part?.process_name ?? "TEST"}</TableCell>
                      <TableCell>{part?.part_code}</TableCell>
                      <TableCell>{part?.part_name}</TableCell>
                      <TableCell>{part?.part_price ?? "100"}</TableCell>
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
