import { FolderKanban } from "lucide-react";
import { FC } from "react";
import MenuPage from "./menu-page";

const MenuManagementPage: FC = () => {
  const data = [
    {
      title: "การจัดการเอกสาร / Document Management",
      href: "document",
      icon: FolderKanban,
      description: "เครื่องมือที่ช่วยในการจัดการเอกสารอย่างมีระเบียบ",
      disabled: false,
    },
    {
      title: "การจัดการเรื่องร้องเรียน / Complaint Management",
      href: "complaint",
      icon: FolderKanban,
      description: "ติดตามและจัดการเรื่องร้องเรียนจากผู้ใช้",
      disabled: false,
    },
  ];

  return (
    <div className="container mx-auto flex h-full w-full flex-col overflow-y-auto p-2">
      <MenuPage {...{ data }} />
    </div>
  );
};

export default MenuManagementPage;
