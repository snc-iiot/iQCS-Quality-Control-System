import MenuBar from "@/components/common/menu-bar";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { Outlet } from "react-router-dom";

const HeaderLayout: FC = () => {
  return (
    <div className={cn("relative flex min-h-[100dvh] w-full flex-col antialiased", "pb-20")}>
      <div className="mx-auto h-full w-full max-w-7xl p-0">
        <Outlet />
      </div>
      <MenuBar />
    </div>
  );
};

export default HeaderLayout;
