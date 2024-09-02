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
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

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
    processes: data?.processes || [],
    part_code: data?.part_code || "",
    part_name: data?.part_name || "",
    price: data?.price || 0,
    sap_code: data?.sap_code || "",
    part_description: data?.part_description || "",
    customers: data?.customers || [],
  });

  // Define a validation schema using Yup
  const validationSchema = Yup.object().shape({
    processes: Yup.array().required("โปรดเลือกกระบวนการผลิต"),
    part_code: Yup.string().required("โปรดระบุ Part No."),
    part_name: Yup.string().required("โปรดระบุชื่อ Part"),
    price: Yup.number().required("โปรดระบุ Price"),
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
        processes: data.processes ?? [],
        part_code: data.part_code ?? "",
        part_name: data.part_name ?? "",
        price: data.price ?? 0,
        sap_code: data?.sap_code || "",
        part_description: data?.part_description || "",
        customers: data?.customers || [],
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
            <InputForm
              label="Part No."
              name="part_code"
              placeholder="โปรดระบุ Part No."
              value={values.part_code}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.part_code}
              required
            />
            <InputForm
              label="Part name"
              placeholder="โปรดระบุชื่อ Part"
              name="part_name"
              value={values.part_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.part_name}
              required
            />
            <InputForm
              label="Part price"
              placeholder="โปรดระบุ Price"
              name="price"
              type="number"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.price}
              required
            />

            <div className="flex flex-col gap-2">
              <div className=" flex gap-2">
                <p className="text-sm font-semibold">Processes</p>
                <p className=" text-red-500">*</p>
              </div>
              {processList?.map((process, i) => (
                <div className="flex items-center gap-2" key={`process-${i}`}>
                  <Checkbox
                    name={process?.process_name}
                    id={process?.process_name}
                    checked={values?.processes?.includes(process?.process_id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleChange({
                          target: {
                            name: "processes",
                            value: [...values?.processes, process?.process_id],
                          },
                        });
                      } else {
                        handleChange({
                          target: {
                            name: "processes",
                            value: values?.processes?.filter((p: string) => p !== process?.process_id),
                          },
                        });
                      }
                    }}
                  />
                  <label htmlFor={process?.process_id} className="text-sm">
                    {process?.process_name}
                  </label>
                </div>
              ))}
              {errors?.processes && <p className="text-xs text-red-500">{errors?.processes}</p>}
            </div>

            <InputForm
              label="SAP code"
              placeholder="ระบุ SAP code"
              name="sap_code"
              value={values.sap_code}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.sap_code}
              labelOptional="(Optional)"
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

            <InputForm
              label="Customer"
              placeholder="ระบุ Customer"
              name="customers"
              value={values.customers[0] || ""}
              onChange={(e) => handleChange({ target: { name: "customers", value: [e.target.value] } })}
              onBlur={handleBlur}
              error={errors.customers}
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
