import { cn } from "@/lib/utils";
import { useMachine } from "@/services/hooks/use-machine";
import { TCreateUpdateMachine } from "@/types";
import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { PageHeader } from "../common/page-header";
import { FormField } from "../ui-pattern";
import { InputForm, TextAreaForm } from "../ui-pattern/form-field/input-form";
import { Button } from "../ui/button";

interface CreateUpdateMachineProps {
  isTitleVisible?: boolean;
  className?: string;
  data?: Partial<TCreateUpdateMachine>;
  onClose?: () => void;
  isPreview?: boolean;
}

export const CreateUpdateMachine: FC<CreateUpdateMachineProps> = ({
  isTitleVisible,
  className,
  data,
  onClose,
  isPreview = false,
}) => {
  const { mutateCreateMachine, mutateUpdateMachine } = useMachine();
  const [initialValues, setInitialValues] = useState<TCreateUpdateMachine>({
    machine_id: data?.machine_id ?? "",
    machine_name: data?.machine_name ?? "",
    machine_no: data?.machine_no ?? "",
    description: data?.description ?? "",
    location: data?.location ?? "",
  });

  // Define a validation schema using Yup
  const validationSchema = Yup.object().shape({
    machine_name: Yup.string().required("โปรดระบุชื่อเครื่องจักร"),
  });

  // Define the submit handler
  const handleSubmit = async (
    values: TCreateUpdateMachine,
    {
      setSubmitting,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
    }
  ) => {
    setSubmitting(true);
    if (data) {
      const res = await mutateUpdateMachine({
        ...data,
        ...values,
      });
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
    if (!data) {
      const res = await mutateCreateMachine(values);
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
  };

  useEffect(() => {
    if (data) {
      setInitialValues({
        machine_id: data?.machine_id ?? "",
        machine_name: data?.machine_name ?? "",
        machine_no: data?.machine_no ?? "",
        description: data?.description ?? "",
        location: data?.location ?? "",
      });
    }
  }, [data]);

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      {isTitleVisible && (
        <PageHeader
          title="บันทึกข้อมูลเครื่องจักร"
          description={
            <div className="flex flex-col gap-1 text-sm">
              <p>โปรดกรอกข้อมูลให้ครบถ้วน</p>
              <div className="flex items-center gap-1">
                <span>จำเป็นต้องกรอก</span>
              </div>
            </div>
          }
          className="sticky top-0 bg-white"
        />
      )}
      <FormField
        id="account-form"
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting }) => (
          <div className="space-y-5">
            <InputForm
              id="machine_name"
              name="machine_name"
              label="ชื่อเครื่องจักร"
              placeholder="ระบุชื่อเครื่องจักร"
              value={values.machine_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.machine_name}
              required
              readOnly={isPreview}
            />
            <InputForm
              id="machine_no"
              name="machine_no"
              label="หมายเลขเครื่องจักร"
              placeholder="ระบุหมายเลขเครื่องจักร"
              value={values.machine_no}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.machine_no}
              required
              readOnly={isPreview}
            />
            <InputForm
              id="location"
              name="location"
              label="สถานที่ตั้ง"
              labelOptional="(Optional)"
              placeholder="ระบุสถานที่ตั้งเครื่องจักร"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              readOnly={isPreview}
            />
            <TextAreaForm
              id="description"
              name="description"
              label="รายละเอียด"
              placeholder="โปรดระบุรายละเอียดเครื่องจักร"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.description}
              labelOptional="(Optional)"
              readOnly={isPreview}
            />
            {!isPreview && (
              <div className="flex justify-end gap-4">
                <Button type="submit" className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                  บันทึก
                </Button>
                <Button variant="secondary" className="w-full" type="reset" onClick={handleReset}>
                  ล้างข้อมูล / Reset
                </Button>
              </div>
            )}
          </div>
        )}
      </FormField>
    </div>
  );
};
