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
    account_id: data?.account_id || "",
    name: data?.name || "",
    remark: data?.remark || "",
  });

  // Define a validation schema using Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("โปรดระบุชื่อ - นามสกุล"),
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
        account_id: data.account_id ?? "",
        name: data.name ?? "",
        remark: data.remark ?? "",
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
              id="name"
              name="name"
              label="ชื่อ - นามสกุล / Name - Surname"
              placeholder="ระบุชื่อ - นามสกุล (ไม่ต้องระบบคำนำหน้าชื่อ)"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              required
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
