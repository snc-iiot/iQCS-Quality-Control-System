import { cn } from "@/lib/utils";
import { FC } from "react";

interface ILoggingTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabsList: { label: string; route: string }[];
}

export const LoggingTabs: FC<ILoggingTabsProps> = ({ activeTab, setActiveTab, tabsList }) => {
  return (
    <div className="sticky -top-0.5 items-center justify-between gap-4 border-b px-4 sm:px-5 md:static md:flex">
      <div className="flex items-center overflow-x-scroll">
        {tabsList.map((tab) => (
          <div key={tab.route} className="cursor-pointer" onClick={() => setActiveTab(tab.route)}>
            <span
              className={cn(
                "flex whitespace-nowrap border-b-2 p-4 text-sm font-medium outline-none",
                activeTab === tab.route ? "border-primary font-semibold text-primary" : ""
              )}
            >
              {tab.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
