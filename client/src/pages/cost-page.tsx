import { PageHeader } from "@/components/common/page-header";
import { FC } from "react";

export const CostPage: FC = () => {
  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <main className="flex h-full w-full flex-col gap-2">
        <PageHeader title="ตั้งค่า % ค่าใช้จ่าย / Cost setting" description="ตั้งค่า % ค่าใช้จ่าย" />
        <div></div>
      </main>
    </div>
  );
};
