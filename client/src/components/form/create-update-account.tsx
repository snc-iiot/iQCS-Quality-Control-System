import { cn } from "@/lib/utils";
import { useAccount } from "@/services/hooks/use-account";
import { TCreateUpdateAccount } from "@/types";
import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { PageHeader } from "../common/page-header";
import { FormField } from "../ui-pattern";
import { InputForm, TextAreaForm } from "../ui-pattern/form-field/input-form";
import { Button } from "../ui/button";

interface CreateUpdateAccountProps {
  isTitleVisible?: boolean;
  className?: string;
  data?: Partial<TCreateUpdateAccount>;
  onClose?: () => void;
}

export const CreateUpdateAccount: FC<CreateUpdateAccountProps> = ({ isTitleVisible, className, data, onClose }) => {
  const { mutateCreateAccount, mutateUpdateAccount } = useAccount();
  const [initialValues, setInitialValues] = useState<TCreateUpdateAccount>({
    operator_id: data?.operator_id || "",
    operator_name: data?.operator_name || "",
    employee_id: data?.employee_id || "",
    position: data?.position || "",
    responsibility: data?.responsibility || "",
    remarks: data?.remarks || "",
  });

  // Define a validation schema using Yup
  const validationSchema = Yup.object().shape({
    operator_name: Yup.string().required("โปรดระบุชื่อ - นามสกุล"),
    employee_id: Yup.string().required("โปรดระบุรหัสพนักงาน"),
  });

  // Define the submit handler
  const handleSubmit = async (
    values: TCreateUpdateAccount,
    {
      setSubmitting,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
    }
  ) => {
    console.log(values);
    setSubmitting(true);
    if (data) {
      const res = await mutateUpdateAccount({
        ...data,
        ...values,
      });
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
    if (!data) {
      const res = await mutateCreateAccount(values);
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
  };

  useEffect(() => {
    if (data) {
      setInitialValues({
        operator_id: data?.operator_id || "",
        operator_name: data?.operator_name || "",
        employee_id: data?.employee_id || "",
        position: data?.position || "",
        responsibility: data?.responsibility || "",
        remarks: data?.remarks || "",
      });
    }
  }, [data]);

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      {isTitleVisible && <PageHeader title="ตั้งค่าบัญชี / Account Setting" description="ตั้งค่าบัญชี" />}
      <FormField
        id="account-form"
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting }) => (
          <div className="space-y-5">
            <InputForm
              id="operator_name"
              name="operator_name"
              label="ชื่อ - นามสกุล / Name - Surname"
              placeholder="ระบุชื่อ - นามสกุล (ไม่ต้องระบบคำนำหน้าชื่อ)"
              value={values.operator_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.operator_name}
              required
            />
            <InputForm
              id="employee_id"
              name="employee_id"
              label="รหัสพนักงาน / Employee ID"
              placeholder="ระบุรหัสพนักงาน"
              value={values.employee_id}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.employee_id}
              required
            />
            <InputForm
              id="position"
              name="position"
              label="ตำแหน่ง / Position"
              placeholder="ระบุตำแหน่ง"
              value={values.position}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.position}
              labelOptional="(Optional)"
            />
            <InputForm
              id="responsibility"
              name="responsibility"
              label="หน้าที่ / Responsibility"
              placeholder="ระบุหน้าที่"
              value={values.responsibility}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.responsibility}
              labelOptional="(Optional)"
            />
            <TextAreaForm
              id="remark"
              name="remark"
              label="หมายเหตุ"
              placeholder="หมายเหตุ"
              value={values.remark}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.remark}
              labelOptional="(Optional)"
            />
            <div className="flex justify-end gap-4">
              <Button type="submit" className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                บันทึก
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
