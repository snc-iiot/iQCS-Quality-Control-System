import { ClipboardPenLine } from "lucide-react";
import { FC } from "react";
import MenuPage from "./menu-page";

const MenuLoggingPage: FC = () => {
  const data = [
    {
      title: "ยอดการผลิต / Productivity",
      href: "productivity",
      icon: ClipboardPenLine,
      description: "บันทึกยอดการผลิตในแต่ล่ะช่วงเวลา",
      disabled: false,
    },
    {
      title: "ยอดงานเสีย / NG product",
      href: "ng-product",
      icon: ClipboardPenLine,
      description: "บันทึกจำนวนผลิตภัณฑ์ที่ไม่ผ่านมาตรฐานคุณภาพ",
      disabled: false,
    },
  ];

  return (
    <div className="container mx-auto flex h-full w-full flex-col overflow-y-auto p-2">
      <MenuPage {...{ data }} />
    </div>
  );
};

export default MenuLoggingPage;
