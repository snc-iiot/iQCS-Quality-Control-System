import { cn } from "@/lib/utils";
import { usePart } from "@/services/hooks";
import { TCreateUpdateModel } from "@/types";
import { FC, useEffect, useState } from "react";
import { PageHeader } from "../common/page-header";
import { FormField } from "../ui-pattern";
import { InputForm, TextAreaForm } from "../ui-pattern/form-field/input-form";
import { Button } from "../ui/button";
import { validationModelSchema } from "../validations";

interface CreateUpdateModelProps {
  isTitleVisible?: boolean;
  className?: string;
  data?: Partial<TCreateUpdateModel> | null;
  onClose?: () => void;
  isPreview?: boolean;
}

export const CreateUpdateModel: FC<CreateUpdateModelProps> = ({
  isTitleVisible,
  className,
  data,
  onClose,
  isPreview,
}) => {
  const { mutateCreateModel, mutateUpdateModel } = usePart();
  const [initialValues, setInitialValues] = useState<TCreateUpdateModel>({
    model_name: data?.model_name || "",
    model_description: data?.model_description || "",
  });

  // Define the submit handler
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    if (data) {
      const res = await mutateUpdateModel({
        ...data,
        ...values,
      });
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
    if (!data) {
      const res = await mutateCreateModel(values);
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
  };

  useEffect(() => {
    if (data) {
      setInitialValues({
        model_name: data?.model_name ?? "",
        model_description: data?.model_description ?? "",
      });
    }
  }, [data]);

  return (
    <div className={cn("space-y-4", className)}>
      {isTitleVisible && (
        <PageHeader
          title={data ? "แก้ไข Model" : "เพิ่ม Model"}
          description={
            <div className="flex flex-col gap-1 text-sm">
              <p>โปรดกรอกข้อมูลให้ครบถ้วน</p>
              <div className="flex items-center gap-1">
                <span>จำเป็นต้องกรอก</span>
              </div>
            </div>
          }
        />
      )}
      <FormField
        id="create-update-model"
        initialValues={initialValues}
        validationSchema={validationModelSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting }) => (
          <div className="space-y-5">
            <InputForm
              label="ชื่อ Model"
              name="model_name"
              value={values.model_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.model_name}
              required
              readOnly={isPreview}
            />
            <TextAreaForm
              label="รายละเอียด"
              name="model_description"
              value={values.model_description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.model_description}
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
