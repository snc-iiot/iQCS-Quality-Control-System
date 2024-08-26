import { cn } from "@/lib/utils";
import { FC } from "react";

interface SpinnerProps {
  size?: number;
}

export const Spinner: FC<SpinnerProps> = ({ size = 24 }) => {
  return (
    <div className={cn("animate-spin rounded-full border-b-2 border-t-2 border-primary", `h-${size} w-${size}`)}></div>
  );
};
