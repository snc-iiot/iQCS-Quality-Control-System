import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { FC, useState } from "react";

export const AccountSettingPage: FC = () => {
  const [search, setSearch] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const HEADER = [
    {
      label: "No.",
      key: "no",
    },
    {
      label: "ชื่อ - นามสกุล / Name - Surname",
      key: "name",
    },
    {
      label: "หมายเหตุ / Remark",
      key: "remark",
    },
    {
      label: "Action",
      key: "action",
    },
  ];

  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <main className="flex h-full w-full flex-col gap-2">
        <PageHeader title="ตั้งค่า Operator name / Operator name setting" description="ตั้งค่าชื่อ Operator " />
        <div className="flex w-full justify-between">
          <Input placeholder="ค้นหา" className="w-1/3" onChange={(e) => setSearch(e.target.value)} value={search} />
          <Button onClick={() => setIsDialogOpen(true)}>Add Part</Button>
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
            <TableBody></TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};
