import Header from "@/components/common/header";
import { FC } from "react";
import { Outlet } from "react-router-dom";

export const OverviewLayout: FC = () => {
  return (
    <div className={"relative flex h-[100dvh] w-full flex-col antialiased"}>
      <Header
        title="Quality Control System"
        subtitle="บันทึกข้อมูลของเสีย"
        icon="mapPin"
        color="blue"
        isAvatar={false}
        disableNav={true}
      />
      <div className="relative flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};
