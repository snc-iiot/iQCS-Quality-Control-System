import { PageHeader } from "@/components/common/page-header";
import { CreateUpdateProcess } from "@/components/form";
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
import { useProcess } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TProcess } from "@/types";
import { MoveIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";

const HEADER = [
  "",
  "No.",
  "Process Color",
  "Process Name",
  "Process Description",
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
  const [orderedProcess, setOrderedProcess] = useState<TProcess[]>(processList);

  const { mutateDeleteProcess, mutatePatchProcessesOrder } = useProcess();

  useEffect(() => {
    setOrderedProcess(processList);
  }, [processList]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredProcess = orderedProcess.filter((process) =>
    process.process_name.toLowerCase().includes(search.toLowerCase())
  );

  const reorder = (list: TProcess[], startIndex: number, endIndex: number): TProcess[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const handleReorder = async (newITem: string[]) => {
    await mutatePatchProcessesOrder({ processes: newITem });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = reorder(filteredProcess, result.source.index, result.destination.index);
    const ids = items?.map((item) => item.process_id);
    setOrderedProcess(items);
    handleReorder(ids);
  };

  const handleDeleteProcess = async (processId: string) => {
    await mutateDeleteProcess(processId);
  };

  const handleEditProcess = (process: TProcess) => {
    setSelectedProcess(process);
    setIsDialogUpdateOpen(true);
  };

  const ActionWithAuth = WithAdminHOC(() => <AlertDialogTrigger className="text-red-500">Delete</AlertDialogTrigger>);

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <main className="flex h-full w-full flex-col gap-2">
        <div className="flex flex-col gap-2 md:flex-row">
          <PageHeader
            title="ตั้งค่ากระบวนการผลิต / Process setting"
            description="ตั้งค่ากระบวนการผลิต และ สามารถเพิ่ม ลบ แก้ไข"
          />
          <div className="flex w-full justify-end gap-2">
            <Input placeholder="ค้นหา" className="w-full md:w-1/4" onChange={handleSearchChange} value={search} />
            <Button className="whitespace-nowrap" onClick={() => setIsDialogOpen(true)}>
              Add Process
            </Button>
          </div>
        </div>
        <div className="flex h-full w-full flex-col overflow-y-auto rounded-md border">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="process-table">
              {(provided: DroppableProvided) => (
                <Table
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="relative h-full w-full border-collapse"
                >
                  <TableHeader className="sticky top-0 z-10 bg-secondary">
                    <TableRow>
                      {HEADER.map((header) => (
                        <TableHead key={header} className="whitespace-nowrap text-sm">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProcess?.length === 0 ? (
                      <TableRow>
                        <TableCell className="text-center" colSpan={HEADER.length}>
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProcess?.map((process, index) => (
                        <Draggable key={process.process_id} draggableId={process.process_id} index={index}>
                          {(provided: DraggableProvided) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="whitespace-nowrap"
                            >
                              <TableCell>
                                <MoveIcon size={14} />
                              </TableCell>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <div
                                  className="h-6 w-6 rounded-full"
                                  style={{ backgroundColor: process.process_color }}
                                />
                              </TableCell>
                              <TableCell>{process.process_name}</TableCell>
                              <TableCell>{process.process_description || "-"}</TableCell>
                              <TableCell>{renderFormattedDateWithTime(new Date(process.created_at))}</TableCell>
                              <TableCell>{renderFormattedDateWithTime(new Date(process.updated_at))}</TableCell>
                              <TableCell className="whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEditProcess(process)}
                                    className="text-blue-500 hover:underline"
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
                                        <AlertDialogAction onClick={() => handleDeleteProcess(process.process_id)}>
                                          ลบ / Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </TableBody>
                </Table>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </main>
      {/* Dialogs */}
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
