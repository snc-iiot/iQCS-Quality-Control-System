import { CreateUpdateProductivity } from "@/components/form";
import { FC } from "react";

const LoggingProductivityPage: FC = () => {
  return (
    <div className="container mx-auto flex h-full w-full flex-col overflow-y-auto p-2">
      <CreateUpdateProductivity />
    </div>
  );
};

export default LoggingProductivityPage;
