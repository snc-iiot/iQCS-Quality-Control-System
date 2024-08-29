//rafce tap tap

import Header from "@/components/common/header";
import { TableCauseNg } from "@/components/common/table-cause-ng";

// import { SettingNGForm } from "@/components/form/setting-ng-form";

export const SettingCausePage = () => {
  return (
    <div className="relative flex h-full w-full flex-col gap-4">
      <Header
        title="Quality Control System"
        subtitle="บันทึกข้อมูลของเสีย"
        icon="mapPin"
        color="blue"
        isAvatar={false}
        isShowInput={false}
      />

      <div>
        <TableCauseNg />
      </div>
    </div>
  );
};
