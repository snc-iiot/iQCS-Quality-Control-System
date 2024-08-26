import { cn } from "@/lib/utils";
import * as React from "react";

export interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  icon?: React.ReactNode; // Add a prop for the icon
}

const CustomSelect = React.forwardRef<HTMLSelectElement, CustomSelectProps>(({ className, icon, ...props }, ref) => {
  return (
    <div className={cn("relative inline-flex w-full items-center", className)}>
      {icon ? (
        <div className="pointer-events-none absolute right-3">{icon}</div>
      ) : (
        <div className="pointer-events-none absolute right-3">
          <svg
            className="h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}

      <select
        className={cn(
          "flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          icon ? "pl-10" : "" // Add left padding if there's an icon
        )}
        ref={ref}
        {...props}
      >
        {props.placeholder && <option value="">{props.placeholder}</option>}
        {props.children}
      </select>
    </div>
  );
});

CustomSelect.displayName = "CustomSelect";
export { CustomSelect };
