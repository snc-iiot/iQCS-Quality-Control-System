import { cn } from "@/lib/utils";
import { useAuth } from "@/services/hooks/use-auth";
import { Eye, EyeOff } from "lucide-react";
import { FC, useState } from "react";
import * as Yup from "yup";
import { PageHeader } from "../common/page-header";
import { Required } from "../common/required";
import { FormField } from "../ui-pattern";
import { InputForm } from "../ui-pattern/form-field/input-form";
import { Button } from "../ui/button";

interface ChangePasswordProps {
  isTitleVisible?: boolean;
  className?: string;
  onClose?: () => void;
}

export const ChangePassword: FC<ChangePasswordProps> = ({ isTitleVisible, className, onClose }) => {
  const { mutateChangePassword } = useAuth();
  const [view, setView] = useState({
    old_password: false,
    new_password: false,
    confirm_new_password: false,
  });

  // Define a validation schema using Yup
  const validationSchema = Yup.object().shape({
    old_password: Yup.string().required("โปรดระบุ รหัสผ่าน"),
    new_password: Yup.string().required("โปรดระบุ รหัสผ่านใหม่"),
    confirm_new_password: Yup.string()
      .required("โปรดยืนยัน รหัสผ่านใหม่")
      .oneOf([Yup.ref("new_password"), ""], "การยืนยันรหัสผ่านไม่ตรงกับรหัสผ่านใหม่"),
  });

  // Define the submit handler
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    const res = await mutateChangePassword(values);
    setSubmitting(res?.status == "success" ? false : true);
    if (res?.status == "success") {
      onClose && onClose();
    }
  };

  return (
    <div className={cn("relative flex w-full flex-col gap-2", className)}>
      {isTitleVisible && (
        <PageHeader
          title="บันทึกข้อมูล Part"
          description={
            <div className="flex flex-col gap-1 text-sm">
              <p>โปรดกรอกข้อมูลให้ครบถ้วน</p>
              <div className="flex items-center gap-1">
                <Required />
                <span>จำเป็นต้องกรอก</span>
              </div>
            </div>
          }
          className="sticky top-0 bg-white"
        />
      )}

      <FormField
        id="part-form"
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        initialValues={{
          old_password: "",
          new_password: "",
          confirm_new_password: "",
        }}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting }) => (
          <div className="space-y-5">
            <div className=" relative">
              <InputForm
                label="Old password"
                placeholder="โปรดระบุ รหัสผ่าน"
                name="old_password"
                value={values.old_password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.old_password}
                type={view?.old_password ? "" : "old_password"}
                required
              />
              {view?.old_password ? (
                <EyeOff
                  className=" absolute bottom-2 right-2 cursor-pointer text-gray-400 hover:text-black"
                  onClick={() => setView({ ...view, old_password: false })}
                />
              ) : (
                <Eye
                  className=" absolute bottom-2 right-2 cursor-pointer text-gray-400 hover:text-black"
                  onClick={() => setView({ ...view, old_password: true })}
                />
              )}
            </div>

            <div className=" relative">
              <InputForm
                label="New password"
                placeholder="โปรดระบุ รหัสผ่านใหม่"
                name="new_password"
                value={values.new_password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.new_password}
                type={view?.new_password ? "" : "password"}
                required
              />
              {view?.new_password ? (
                <EyeOff
                  className=" absolute bottom-2 right-2 cursor-pointer text-gray-400 hover:text-black"
                  onClick={() => setView({ ...view, new_password: false })}
                />
              ) : (
                <Eye
                  className=" absolute bottom-2 right-2 cursor-pointer text-gray-400 hover:text-black"
                  onClick={() => setView({ ...view, new_password: true })}
                />
              )}
            </div>

            <div className=" relative">
              <InputForm
                label="Confirm new password"
                placeholder="โปรดยืนยัน รหัสผ่านใหม่"
                name="confirm_new_password"
                value={values.confirm_new_password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirm_new_password}
                type={view?.confirm_new_password ? "" : "password"}
                required
              />
              {view?.confirm_new_password ? (
                <EyeOff
                  className=" absolute bottom-2 right-2 cursor-pointer text-gray-400 hover:text-black"
                  onClick={() => setView({ ...view, confirm_new_password: false })}
                />
              ) : (
                <Eye
                  className=" absolute bottom-2 right-2 cursor-pointer text-gray-400 hover:text-black"
                  onClick={() => setView({ ...view, confirm_new_password: true })}
                />
              )}
            </div>

            <div className="flex w-full gap-2">
              <Button className="w-full" type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                บันทึก / Save
              </Button>
              <Button variant="secondary" className="w-full" type="reset" onClick={handleReset}>
                ล้างข้อมูล / Reset
              </Button>
            </div>
          </div>
        )}
      </FormField>
    </div>
  );
};
