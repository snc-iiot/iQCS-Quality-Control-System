import { PageHeader } from "@/components/common/page-header";
import { CreateUpdatePart, CreateUpdatePartPrice } from "@/components/form";
import { WithAdminHOC } from "@/components/hoc";
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
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { renderFormattedDateWithTime } from "@/helpers/date-time.helper";
import { usePart } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TPart } from "@/types";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const HEADER = [
  "No.",
  "Process.",
  "Part No.",
  "Part Name",
  "Model",
  "Local/SKD",
  "Part Price",
  "SAP Code.",
  "Part Description",
  "Customer",
  "Created Date",
  "Updated Date",
  "#",
];

const HEADER_HISTORY = [
  "No.",
  "Effective Date",
  "Price",
  "NG Price",
  "Scrap Price",
  "Rework Price",
  "Remarks",
  "Creator By",
  "Created Date",
  "Updated Date",
  "#",
];

export const PartPage: FC = () => {
  const navigate = useNavigate();
  const { partList, processList, historyUpdatePriceList, modelList } = useAtomStore();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [isUpdatePriceDialogOpen, setIsUpdatePriceDialogOpen] = useState<boolean>(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState<boolean>(false);

  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState<boolean>(false);
  const [fields, setFields] = useState<{ [key: string]: string[] }>({});

  const [selectedPart, setSelectedPart] = useState<TPart | null>(null);

  const [search, setSearch] = useState<string>("");

  const filteredPart = partList?.filter(
    (part) =>
      (part?.part_code?.toLowerCase().includes(search.toLowerCase()) ||
        part?.part_name?.toLowerCase().includes(search.toLowerCase()) ||
        String(part?.price)
          ?.toLowerCase()
          .includes(search.toLowerCase())) &&
      (part?.processes?.some((process) => fields?.process?.includes(process)) || (fields?.process?.length ?? 0) === 0)
  );

  const { mutateDeletePart, mutateDeleteUpdatePrice } = usePart();

  const ActionWithAuth = WithAdminHOC(() => (
    <AlertDialogTrigger className="text-red-500 hover:underline">Delete</AlertDialogTrigger>
  ));

  const DeleteHistory = WithAdminHOC(() => (
    <AlertDialogTrigger className="text-red-500 hover:underline">Delete</AlertDialogTrigger>
  ));

  const filterByPart = (part_id: string) => {
    return historyUpdatePriceList?.filter((item) => item?.part_id === part_id);
  };

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
                    options={processList?.map(({ process_name, process_id }) => ({
                      label: process_name,
                      value: process_id,
                    }))}
                  />
                </div>
              }
            />
            <Button
              variant="outline"
              className="whitespace-nowrap"
              onClick={() => {
                // part/import
                navigate("/settings/part/import");
              }}
            >
              Import Part List
            </Button>
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
                      <TableCell>
                        {part?.processes
                          ?.map(
                            (item) => processList?.find(({ process_id }) => process_id === item)?.process_name ?? ""
                          )
                          ?.filter((info) => info != "" && info != null)
                          ?.join(", ") ?? "TEST"}
                      </TableCell>
                      <TableCell>{part?.part_code}</TableCell>
                      <TableCell>{part?.part_name}</TableCell>
                      <TableCell>
                        {modelList?.find(({ model_id }) => model_id === part?.model_id)?.model_name ?? ""}
                      </TableCell>
                      <TableCell>{part?.type}</TableCell>
                      <TableCell>{part?.price ?? "0.00"}</TableCell>
                      <TableCell>{part?.sap_code || "-"}</TableCell>
                      <TableCell>{part?.part_description || "-"}</TableCell>
                      <TableCell>{part?.customers[0] || "-"}</TableCell>
                      <TableCell>{renderFormattedDateWithTime(new Date(part?.created_at))}</TableCell>
                      <TableCell>{renderFormattedDateWithTime(new Date(part?.updated_at))}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (filterByPart(part?.part_id)?.length === 0) {
                                setSelectedPart(part);
                                setIsUpdatePriceDialogOpen(true);
                              } else {
                                setSelectedPart(part);
                                setIsHistoryDialogOpen(true);
                              }
                            }}
                            className="text-blue-500 hover:underline"
                          >
                            {filterByPart(part?.part_id)?.length === 0 ? "Update Price" : "View History"}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPart(part);
                              setIsDialogUpdateOpen(true);
                            }}
                            className="text-yellow-500 hover:underline"
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
                                    await mutateDeletePart(part?.part_id);
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
          <div className="max-h-[60vh] overflow-y-scroll">
            <CreateUpdatePart onClose={() => setIsDialogOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isDialogUpdateOpen} onOpenChange={setIsDialogUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไข Part / Edit Part</DialogTitle>
            <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-scroll">
            <CreateUpdatePart
              data={{
                model_id: selectedPart?.model_id,
                part_id: selectedPart?.part_id,
                part_code: selectedPart?.part_code,
                part_name: selectedPart?.part_name,
                price: Number(selectedPart?.price),
                type: selectedPart?.type,
                processes: selectedPart?.processes,
                sap_code: selectedPart?.sap_code || "",
                part_description: selectedPart?.part_description || "",
                customers: selectedPart?.customers || [],
              }}
              onClose={() => {
                setIsDialogUpdateOpen(false);
                setSelectedPart(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isUpdatePriceDialogOpen}
        onOpenChange={(isOpen) => {
          setIsUpdatePriceDialogOpen(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update part price</DialogTitle>
            <DialogDescription>Please fill in the information completely</DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <CreateUpdatePartPrice
              data={{
                effective_date: "",
                part_id: selectedPart?.part_id,
                price: null,
                remarks: "",
              }}
              onClose={() => {
                setIsUpdatePriceDialogOpen(false);
                if (!isHistoryDialogOpen) {
                  setSelectedPart(null);
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Sheet
        open={isHistoryDialogOpen}
        onOpenChange={(isOpen) => {
          setIsHistoryDialogOpen(isOpen);
        }}
      >
        <SheetContent style={{ maxWidth: "70vw" }}>
          <SheetHeader>
            <SheetTitle>ประวัติการอัพเดทราคา / History Update Price</SheetTitle>
            <SheetDescription>
              แสดงรายการประวัติการอัพเดทราคาของ Part / Show the history of price update of the part
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary">
                  {HEADER_HISTORY.map((header) => (
                    <TableHead className="whitespace-nowrap" key={header}>
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterByPart(selectedPart?.part_id ?? "")?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {item?.effective_date ? renderFormattedDateWithTime(new Date(item?.effective_date)) : "-"}
                    </TableCell>
                    <TableCell className="text-right">{item?.price}</TableCell>
                    <TableCell className="text-right">{item?.ng_price}</TableCell>
                    <TableCell className="text-right">{item?.scrap_price}</TableCell>
                    <TableCell className="text-right">{item?.rework_price}</TableCell>
                    <TableCell>{item?.remarks ?? "-"}</TableCell>
                    <TableCell>{item?.creator_name}</TableCell>
                    <TableCell>{renderFormattedDateWithTime(new Date(item?.created_at))}</TableCell>
                    <TableCell>{renderFormattedDateWithTime(new Date(item?.updated_at))}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <DeleteHistory />
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>คุณต้องการลบข้อมูลหรือไม่? / Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              การกระทำนี้ไม่สามารถย้อนกลับได้ / This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                await mutateDeleteUpdatePrice(item?.update_price_id);
                              }}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <SheetFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdatePriceDialogOpen(true);
              }}
            >
              อัพเดทราคา / Update Price
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
