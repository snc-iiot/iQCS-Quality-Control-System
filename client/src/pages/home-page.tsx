import { CreateUpdateDefect, CreateUpdateDefectMultiple } from "@/components/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC } from "react";

const HomePage: FC = () => {
  return (
    <div className="container mx-auto flex h-full w-full flex-col overflow-y-auto p-2">
      <Tabs defaultValue="multiple-case">
        <TabsList className="max-w-max">
          <TabsTrigger value="multiple-case">บันทึกข้อมูลแบบหลายอาการ</TabsTrigger>
          <TabsTrigger value="one-case">บันทึกข้อมูลแบบอาการเดียว</TabsTrigger>
        </TabsList>
        <TabsContent value="multiple-case">
          <CreateUpdateDefectMultiple />
        </TabsContent>
        <TabsContent value="one-case">
          <CreateUpdateDefect />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
