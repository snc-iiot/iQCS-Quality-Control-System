import { cn } from "@/lib/utils";
import { FC } from "react";

interface PageHeaderProps {
  title: string;
  description?: string | React.ReactNode;
  className?: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, description, className }) => {
  const typeOfDescription = typeof description;

  return (
    <div className={cn("w-full", className)}>
      <h1 className="text-base font-semibold">{title}</h1>
      {description && (
        <div>{typeOfDescription === "string" ? <p className="text-sm">{description}</p> : description}</div>
      )}
    </div>
  );
};
