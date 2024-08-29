import { cn } from "@/lib/utils";
import { usePart } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TCreateUpdatePart } from "@/types";
import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { PageHeader } from "../common/page-header";
import { Required } from "../common/required";
import { FormField } from "../ui-pattern";
import { InputForm, TextAreaForm } from "../ui-pattern/form-field/input-form";
import { SelectForm } from "../ui-pattern/form-field/select-form";
import { Button } from "../ui/button";

interface CreateUpdatePartProps {
  isTitleVisible?: boolean;
  className?: string;
  data?: Partial<TCreateUpdatePart>;
  onClose?: () => void;
}

export const CreateUpdatePart: FC<CreateUpdatePartProps> = ({ isTitleVisible, className, data, onClose }) => {
  const { processList } = useAtomStore();
  const { mutateCreatePart, mutateUpdatePart } = usePart();
  const [initialValues, setInitialValues] = useState<TCreateUpdatePart>({
    process_id: data?.process_id || "",
    part_code: data?.part_code || "",
    part_name: data?.part_name || "",
    part_price: data?.part_price || 0,
    part_description: data?.part_description || "",
  });

  const dataProcessList = processList?.map((info) => ({ label: info?.process_name, value: info?.process_name }));

  // Define a validation schema using Yup
  const validationSchema = Yup.object().shape({
    process_id: Yup.string().required("โปรดเลือกกระบวนการผลิต"),
    part_code: Yup.string().required("โปรดระบุ Part No."),
    part_name: Yup.string().required("โปรดระบุชื่อ Part"),
    part_price: Yup.number().required("โปรดระบุ Price"),
  });

  // Define the submit handler
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    if (data) {
      const res = await mutateUpdatePart({
        ...data,
        ...values,
      });
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
    if (!data) {
      const res = await mutateCreatePart(values);
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
  };

  useEffect(() => {
    if (data) {
      setInitialValues({
        process_id: data.process_id ?? "",
        part_code: data.part_code ?? "",
        part_name: data.part_name ?? "",
        part_price: data.part_price ?? 0,
        part_description: data.part_description ?? "",
      });
    }
  }, [data]);

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
        initialValues={initialValues}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting }) => (
          <div className="space-y-5">
            <SelectForm
              value={values?.process_id}
              label="กระบวนการผลิต / Process"
              placeholder="เลือกกระบวนการผลิต"
              required
              options={dataProcessList}
            />

            <InputForm
              label="Part No."
              name="part_code"
              placeholder="โปรดระบุ Part No."
              value={values.part_code}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.part_code}
            />
            <InputForm
              label="Part name"
              placeholder="โปรดระบุชื่อ Part"
              name="part_name"
              value={values.part_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.part_name}
            />
            <InputForm
              label="Part price"
              placeholder="โปรดระบุ Price"
              name="part_price"
              type="number"
              value={values.part_price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.part_price}
            />
            <TextAreaForm
              label="Description"
              placeholder="โปรดระบุรายละเอียด"
              name="part_description"
              value={values.part_description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.part_description}
              labelOptional="(Optional)"
            />
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
