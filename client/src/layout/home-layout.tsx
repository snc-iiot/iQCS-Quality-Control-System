import Header from "@/components/common/header";
import MenuBar from "@/components/common/menu-bar";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { AuthLayout } from "./auth-layout";

const HomeLayout: FC = () => {
  return (
    <AuthLayout>
      <div className={"relative flex h-[100dvh] w-full flex-col antialiased"}>
        <Header
          title="Quality Control System"
          subtitle="บันทึกข้อมูลของเสีย"
          icon="mapPin"
          color="blue"
          isAvatar={false}
        />
        <div className="relative flex-1 overflow-hidden">
          <Outlet />
        </div>
        <div className="block border-t md:hidden">
          <MenuBar />
        </div>
      </div>
    </AuthLayout>
  );
};

export default HomeLayout;
