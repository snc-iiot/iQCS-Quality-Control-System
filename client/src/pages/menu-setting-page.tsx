import { Settings } from "lucide-react";
import { FC } from "react";
import MenuPage from "./menu-page";

const MenuSettingPage: FC = () => {
  const data = [
    {
      title: "ตั้งค่าสาเหตุการเสีย / Setting Cause",
      href: "cause",
      icon: Settings,
      description: "ตั้งค่าสาเหตุการเสีย",
      disabled: false,
    },
    {
      title: "ตั้งค่า Part ที่ใช้งาน / Setting Part",
      href: "part",
      icon: Settings,
      description: "ตั้งค่า Part ที่ใช้งาน และ สามารถเพิ่ม ลบ แก้ไข",
      disabled: false,
    },
  ];

  return (
    <div className="container mx-auto flex h-full w-full flex-col overflow-y-auto p-2">
      <MenuPage {...{ data }} />
    </div>
  );
};

export default MenuSettingPage;
