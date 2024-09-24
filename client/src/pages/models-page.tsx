import { PageHeader } from "@/components/common/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { renderFormattedDateWithTime } from "@/helpers/date-time.helper";
import { useAtomStore } from "@/store";
import { FC } from "react";

export const ModelPage: FC = () => {
  const { modelList } = useAtomStore();

  const HEADER = [
    "No.",
    "ชื่อโมเดล / Model name",
    "รายละเอียด / Description",
    "วันที่สร้าง / Created date",
    "วันที่แก้ไข / Updated date",
    "จัดการ / Action",
  ];
  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <main className="flex h-full w-full flex-col gap-2">
        <div className="flex flex-col gap-2 md:flex-row">
          <PageHeader title="ตั้งค่าโมเดล / Model setting" description="ตั้งค่าโมเดล และ สามารถเพิ่ม ลบ แก้ไข" />
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary">
                {HEADER?.map((item, index) => <TableHead key={index}>{item}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelList?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item?.model_name}</TableCell>
                  <TableCell>{item?.model_description}</TableCell>
                  <TableCell>{renderFormattedDateWithTime(item?.created_at)}</TableCell>
                  <TableCell>{renderFormattedDateWithTime(item?.updated_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button className="btn btn-warning">แก้ไข</button>
                      <button className="btn btn-danger">ลบ</button>
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
