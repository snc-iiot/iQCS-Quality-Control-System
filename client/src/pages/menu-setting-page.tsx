import { ChangePassword } from "@/components/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { FC, useState } from "react";
import MenuPage from "./menu-page";

const MenuSettingPage: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const data = [
    {
      title: "เปลี่ยนรหัสผ่าน / Change password",
      icon: Settings,
      description: "เปลี่ยนรหัสผ่านของคุณ",
      disabled: false,
      onClick: () => {
        setIsDialogOpen(true);
      },
    },
    {
      title: "ตั้งค่ากระบวนการผลิต / Process setting",
      href: "process",
      icon: Settings,
      description: "ตั้งค่ากระบวนการผลิตที่ใช้งาน และ สามารถเพิ่ม ลบ แก้ไข",
      disabled: false,
    },
    {
      title: "ตั้งค่า Part ที่ใช้งาน / Part setting",
      href: "part",
      icon: Settings,
      description: "ตั้งค่า Part ที่ใช้งาน และ สามารถเพิ่ม ลบ แก้ไข",
      disabled: false,
    },
    {
      title: "ตั้งค่าสาเหตุการเสีย / Cause setting",
      href: "cause",
      icon: Settings,
      description: "ตั้งค่าสาเหตุการเสีย",
      disabled: false,
    },
    {
      title: "ตั้งค่า Operator name / Operator name setting",
      href: "account",
      icon: Settings,
      description: "ตั้งค่าชื่อ Operator ",
      disabled: false,
    },
    {
      title: "ตั้งค่า เครื่องจักร / Machine setting",
      href: "machine",
      icon: Settings,
      description: "เพิ่ม ลบ แก้ไข ชื่อเครื่องจักร",
      disabled: false,
    },
    {
      title: "ตั้งค่าอัตราส่วนค่าใช้จ่าย / Cost setting",
      href: "cost",
      icon: Settings,
      description: "จัดการอัตราส่วนค่าใช้จ่าย",
      disabled: false,
    },
  ];

  return (
    <>
      <div className="container mx-auto flex h-full w-full flex-col overflow-y-auto p-2">
        <MenuPage {...{ data }} />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เปลี่ยนรหัสผ่าน / Change password</DialogTitle>
            <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
          </DialogHeader>
          <ChangePassword onClose={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuSettingPage;
