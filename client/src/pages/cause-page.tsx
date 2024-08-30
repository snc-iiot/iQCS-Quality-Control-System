import { PageHeader } from "@/components/common/page-header";
import { CreateUpdateCause } from "@/components/form/create-update-cause";
import { ActionWithAuthHOC } from "@/components/hoc/action-with-auth";
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
import { useNGCause } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TNGCause } from "@/types";
import { FC, useMemo, useState } from "react";

export const CausePage: FC = () => {
  const { ngCauseList, processList } = useAtomStore();
  const [search, setSearch] = useState<string>("");
  const { mutateDeleteNGCause } = useNGCause();

  const [isOpenCreateUpdateDialog, setIsOpenCreateUpdateDialog] = useState<boolean>(false);
  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState<boolean>(false);
  const [selectedNGCause, setSelectedNGCause] = useState<TNGCause | null>(null);

  const HEADER = useMemo(
    () => [
      {
        key: "case_name",
        label: "Case Name",
      },
      {
        key: "description",
        label: "Description",
      },
      {
        key: "processes",
        label: "Processes",
      },
      {
        key: "created_at",
        label: "Created At",
      },
      {
        key: "updated_at",
        label: "Updated At",
      },
      { key: "actions", label: "Actions" },
    ],
    []
  );

  const ActionWithAuth = ActionWithAuthHOC(() => (
    <AlertDialogTrigger className="text-red-500">Delete</AlertDialogTrigger>
  ));

  const ngCauseMapped = useMemo(() => {
    return ngCauseList
      ?.filter((ngCause) => {
        const searchLower = search.toLowerCase();
        return (
          ngCause.case_name?.toLowerCase()?.includes(searchLower) ||
          ngCause.description?.toLowerCase()?.includes(searchLower)
        );
      })
      ?.map((ngCause) => ({
        ...ngCause,
        processes:
          ngCause.processes
            ?.map((info) => processList?.find((item) => item?.process_id === info)?.process_name)
            ?.join(", ") || "-",
        description: ngCause.description || "-",
        created_at: renderFormattedDateWithTime(new Date(ngCause.created_at)),
        updated_at: renderFormattedDateWithTime(new Date(ngCause.updated_at)),
        actions: () => (
          <div className="flex items-center gap-2">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => {
                setSelectedNGCause(ngCause);
                setIsDialogUpdateOpen(true);
              }}
            >
              Edit
            </button>
            <AlertDialog>
              <AlertDialogTrigger>
                <ActionWithAuth />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>คุณต้องการลบข้อมูลนี้ใช่หรือไม่ / Are you sure</AlertDialogTitle>
                  <AlertDialogDescription>
                    การกระทำนี้ไม่สามารถย้อนกลับได้ / This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      await mutateDeleteNGCause(ngCause?.case_id);
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ),
      }));
  }, [ngCauseList, search]);

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <main className="flex h-full w-full flex-col gap-2">
        <div className="flex flex-col gap-2 md:flex-row">
          <PageHeader title="ตั้งค่าสาเหตุการเสีย / Cause settings" description="เพิ่ม แก้ไข ลบ สาเหตุการเสีย" />
          <div className="flex w-full justify-end gap-2">
            <Input
              placeholder="ค้นหา"
              className="w-full md:w-1/4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button className="whitespace-nowrap" onClick={() => setIsOpenCreateUpdateDialog(true)}>
              Add Cause
            </Button>
          </div>
        </div>
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-0 w-full flex-grow flex-col overflow-y-auto rounded-md border">
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
                {ngCauseMapped?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={HEADER.length}>No data available</TableCell>
                  </TableRow>
                )}
                {ngCauseMapped?.map((defect) => (
                  <TableRow className="whitespace-nowrap" key={defect?.case_id}>
                    {HEADER.map((header) => (
                      <TableCell className={cn("whitespace-nowrap")} key={header.label}>
                        {typeof defect?.[header?.key as keyof TNGCause] === "function" && defect
                          ? defect?.actions()
                          : defect && defect?.[header?.key as keyof TNGCause]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <Dialog open={isOpenCreateUpdateDialog} onOpenChange={setIsOpenCreateUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มสาเหตุการเสีย / Add Cause</DialogTitle>
            <DialogDescription>กรุณากรอกข้อมูลด้านล่าง / Please fill in the information</DialogDescription>
          </DialogHeader>
          <CreateUpdateCause onClose={() => setIsOpenCreateUpdateDialog(false)} />
        </DialogContent>
      </Dialog>
      <Dialog open={isDialogUpdateOpen} onOpenChange={setIsDialogUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>แก้ไขสาเหตุการเสีย / Edit Cause</DialogTitle>
            <DialogDescription>กรุณากรอกข้อมูลด้านล่าง / Please fill in the information</DialogDescription>
          </DialogHeader>
          <CreateUpdateCause
            data={{
              case_id: selectedNGCause?.case_id,
              case_name: selectedNGCause?.case_name,
              description: selectedNGCause?.description,
              processes: selectedNGCause?.processes,
            }}
            onClose={() => {
              setIsDialogUpdateOpen(false);
              setSelectedNGCause(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
