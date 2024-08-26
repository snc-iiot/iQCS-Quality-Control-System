import { menuItems } from "@/config/menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "./icons";

const Icon = ({ icon, className = "", ...props }: any) => {
  const IconComponent = Icons[icon as keyof typeof Icons] ?? Icons["arrowLeft"];
  return <IconComponent className={`h-6 w-6 ${className}`} {...props} />;
};

const MenuBar: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const menu = menuItems?.filter((item) => {
    return isMobile ? item?.href != "/log-out" : true;
  });

  return (
    <div className="h-[4.5rem] w-full bg-primary-foreground px-4 py-2 shadow-2xl shadow-line-gray-700">
      <div
        className={cn("h-full w-full")}
        style={{
          display: "grid",
          gridTemplateColumns: `${"1fr ".repeat(menu?.length)}`,
          gap: 0,
        }}
      >
        {menu?.map((item, i) => {
          const isActive =
            item.href === "/settings"
              ? pathname.includes(item.href)
              : pathname.split("?")[0] === item.href?.split("?")[0];
          return (
            <div
              className={cn(
                "relative flex h-full cursor-pointer flex-col items-center justify-start gap-1 text-center",
                isActive ? "font-bold text-line-green" : "text-line-black"
              )}
              key={i}
              onClick={() => navigate(item.href)}
            >
              <div className="relative">
                {item.href === "/notifications" ? (
                  <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-line-red">
                    <p className="text-[10px] font-bold text-white">10</p>
                  </div>
                ) : null}
                <Icon icon={item.icon} />
              </div>
              <p className="text-xs">{item.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuBar;
