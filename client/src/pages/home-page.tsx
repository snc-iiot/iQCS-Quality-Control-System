import { CreateUpdateDefect } from "@/components/form";
import { FC } from "react";

const HomePage: FC = () => {
  return (
    <div className="container mx-auto flex h-full w-full flex-col overflow-y-auto p-2">
      <CreateUpdateDefect />
    </div>
  );
};

export default HomePage;
