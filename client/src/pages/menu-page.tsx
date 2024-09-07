import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";

export type TMenuPage = {
  data: {
    title: string;
    href?: string;
    icon: React.ElementType;
    description: string;
    disabled: boolean;
    onClick?: () => void;
  }[];
};

const MenuPage: FC<TMenuPage> = ({ data }) => {
  return (
    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-3">
      {data.map((item, i) => (
        <Link
          to={item.href || "#"}
          key={i}
          className={cn(
            "relative flex items-center justify-between overflow-hidden rounded-md border px-4 py-4",
            "cursor-pointer hover:bg-accent",
            item.disabled && "pointer-events-none cursor-not-allowed opacity-50"
          )}
          onClick={item.onClick}
        >
          <div className="flex w-full items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2">
              {item.icon && <item.icon className="h-6 w-6" />}
            </div>
            <div className="space-y-1">
              <h1 className="text-sm font-semibold">{item.title}</h1>
              <p className="text-xs text-muted-foreground">{item.description || "No description available"}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ))}
    </div>
  );
};

export default MenuPage;
