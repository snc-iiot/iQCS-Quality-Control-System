import { menuItems } from "@/config/menu";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";
import { LogOut } from "lucide-react";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icons } from "./icons";

interface Props {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  isAvatar?: boolean;
  input?: JSX.Element;
  isShowInput?: boolean;
  disableNav?: boolean;
}

const Icon = ({ icon, className = "", ...props }: any) => {
  const IconComponent = Icons[icon as keyof typeof Icons] ?? Icons["arrowLeft"];
  return <IconComponent className={`h-4 w-4 ${className}`} {...props} />;
};

const Header: FC<Props> = ({ isAvatar = false, disableNav = false }) => {
  const authService = new AuthService();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex w-full items-center justify-between gap-2 border-b bg-line-white px-2 py-4 shadow-sm">
      <div className={cn("flex items-center", isAvatar ? "justify-between" : "")}>
        <img src="https://ipss.sncformer.com/assets/images/logo.webp" alt="logo" className="mr-1 h-auto w-[6rem]" />
        <div className="flex flex-col border-l px-2">
          <h1 className="text-lg font-bold text-line-green">Quality Control System</h1>
          <h1 className="text-xs">SNC Former Company Limited and subsidiaries</h1>
        </div>
      </div>
      {!disableNav && (
        <div className={cn("hidden w-max items-center gap-2 md:flex")}>
          {menuItems?.map((item, index) => {
            const isActive =
              item.href === "/settings"
                ? pathname.includes(item.href)
                : pathname.split("?")[0] === item.href?.split("?")[0];
            return (
              <button
                key={index}
                className={cn(
                  "hover-underline-animation rounded-md bg-transparent px-4 py-2 text-sm font-normal text-secondary-foreground hover:text-line-green",
                  isActive ? "hover-underline-animation--hover-on font-semibold text-line-green" : ""
                )}
                onClick={() => {
                  if (item.href === "/log-out") {
                    authService.signOut();
                    navigate("/login");
                  } else {
                    navigate(item.href);
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  <Icon icon={item?.icon} />
                  <p className="text-sm">{item?.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
      <button
        className="flex items-center gap-1 md:hidden lg:hidden"
        onClick={async () => {
          const isLogged = await authService.signOut();
          isLogged && navigate("/login");
        }}
      >
        <LogOut size={20} className="text-red-500" />
      </button>
    </div>
  );
};

export default Header;
