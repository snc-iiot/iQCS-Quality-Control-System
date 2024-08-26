import { SettingList } from "@/components/common/setting-list";
import { FC } from "react";

export const SettingsPage: FC = () => {
  return (
    <div className="relative flex h-full w-full flex-col gap-4 p-4">
      <SettingList />
    </div>
  );
};
