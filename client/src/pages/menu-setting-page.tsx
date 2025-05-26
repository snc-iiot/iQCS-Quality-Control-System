import { ChangePassword } from "@/components/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { FC, useState } from "react";
import MenuPage from "./menu-page";

const menuItems = [
  {
    title: "เปลี่ยนรหัสผ่าน / Change Password",
    icon: Settings,
    description: "ปรับเปลี่ยนรหัสผ่านของคุณ / Change your password",
    disabled: false,
  },
  {
    title: "การตั้งค่ากระบวนการผลิต / Process Settings",
    href: "process",
    icon: Settings,
    description:
      "จัดการการตั้งค่ากระบวนการผลิต รวมถึงการเพิ่ม ลบ และแก้ไข / Manage production process settings, including adding, deleting, and editing",
    disabled: false,
  },
  {
    title: "การตั้งค่าพาร์ท / Part Settings",
    href: "part",
    icon: Settings,
    description:
      "จัดการการตั้งค่าพาร์ท รวมถึงการเพิ่ม ลบ และแก้ไข / Manage Part settings, including adding, deleting, and editing",
    disabled: false,
  },
  {
    title: "การตั้งค่า Model / Model Settings",
    href: "model",
    icon: Settings,
    description:
      "จัดการการตั้งค่า Model รวมถึงการเพิ่ม ลบ และแก้ไข / Manage Model settings, including adding, deleting, and editing",
    disabled: false,
  },
  {
    title: "การตั้งค่าอาการการเสีย / Cause Settings",
    href: "cause",
    icon: Settings,
    description: "จัดการการตั้งค่าอาการการเสีย / Manage Cause settings",
    disabled: false,
  },
  {
    title: "การตั้งค่า Operator Name / Operator Name Settings",
    href: "account",
    icon: Settings,
    description: "จัดการการตั้งค่าชื่อ Operator / Manage operator name settings",
    disabled: false,
  },
  {
    title: "การตั้งค่าเครื่องจักร / Machine Settings",
    href: "machine",
    icon: Settings,
    description:
      "จัดการการตั้งค่าชื่อเครื่องจักร รวมถึงการเพิ่ม ลบ และแก้ไข / Manage machine settings, including adding, deleting, and editing",
    disabled: false,
  },
  {
    title: "การตั้งค่าอัตราส่วนค่าใช้จ่าย / Cost Settings",
    href: "cost",
    icon: Settings,
    description: "จัดการอัตราส่วนค่าใช้จ่าย / Manage cost settings",
    disabled: false,
  },
];

const MenuSettingPage: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleClick = (title: string) => {
    if (title === "เปลี่ยนรหัสผ่าน / Change Password") {
      setIsDialogOpen(true);
    }
  };

  const mapMenuItems = menuItems.map((item) => ({
    ...item,
    onClick: item.title === "เปลี่ยนรหัสผ่าน / Change Password" ? () => handleClick(item.title) : undefined,
  }));

  return (
    <>
      <div className="container mx-auto flex h-full w-full flex-col overflow-y-auto p-2">
        <MenuPage data={mapMenuItems} />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80%] overflow-auto">
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
