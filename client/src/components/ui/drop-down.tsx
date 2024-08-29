import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FC, ReactNode } from "react";
import { Button } from "./button";

type TDropdown = {
  label?: string;
  className?: string;
  icon?: ReactNode;
  content?: ReactNode;
};

const Dropdown: FC<TDropdown> = ({ label = "", className, icon, content }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        {label === "" ? (
          <div>{icon}</div>
        ) : (
          <Button className={cn("gap-2 bg-blue-600 font-bold hover:bg-blue-700 ", className)}>
            {label} {icon}
          </Button>
        )}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="DropdownMenuContent z-50" sideOffset={5}>
          {content}
          <DropdownMenu.Arrow className="DropdownMenuArrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export { Dropdown };
