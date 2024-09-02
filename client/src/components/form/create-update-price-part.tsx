import { cn } from "@/lib/utils";
import { usePart } from "@/services/hooks";
import { TCreateUpdatePartPrice } from "@/types";
import { FC, useEffect, useState } from "react";
import { PageHeader } from "../common/page-header";
import { FormField } from "../ui-pattern";
import { DateInputForm, InputForm, TextAreaForm } from "../ui-pattern/form-field/input-form";
import { Button } from "../ui/button";
import { validationUpdatePartPriceSchema } from "../validations";

interface CreateUpdatePartPriceProps {
  isTitleVisible?: boolean;
  className?: string;
  data?: Partial<TCreateUpdatePartPrice>;
  onClose?: () => void;
  isPreview?: boolean;
}

export const CreateUpdatePartPrice: FC<CreateUpdatePartPriceProps> = ({
  isTitleVisible,
  className,
  data,
  isPreview = false,
  onClose,
}) => {
  const [initialValues, setInitialValues] = useState<TCreateUpdatePartPrice>({
    effective_date: data?.effective_date ?? "",
    part_id: data?.part_id ?? "",
    price: data?.price ?? null,
    remarks: data?.remarks ?? "",
  });

  const { mutateUpdatePartPrice } = usePart();

  // Define the submit handler
  const handleSubmit = async (
    values: TCreateUpdatePartPrice,
    {
      setSubmitting,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
    }
  ) => {
    setSubmitting(true);
    if (data) {
      const res = await mutateUpdatePartPrice({
        ...data,
        ...values,
      });
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
  };

  useEffect(() => {
    setInitialValues({
      effective_date: data?.effective_date ?? "",
      part_id: data?.part_id ?? "",
      price: data?.price ?? null,
      remarks: data?.remarks ?? "",
    });
  }, [data]);

  return (
    <div className={cn("relative flex w-full flex-col gap-2 px-4", className)}>
      {isTitleVisible && (
        <PageHeader
          title="Create Part Price"
          description="Please fill in the information completely"
          className="sticky top-0 bg-white"
        />
      )}
      <FormField
        initialValues={initialValues}
        validationSchema={validationUpdatePartPriceSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting }) => (
          <div className="space-y-5">
            <DateInputForm
              id="effective_date"
              label="Effective Date"
              value={values.effective_date}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.effective_date}
              disabled={isSubmitting}
              required
            />
            <InputForm
              id="price"
              label="Price"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.price}
              disabled={isSubmitting}
              required
              placeholder="Enter price"
              type="number"
              inputMode="decimal"
            />
            <TextAreaForm
              id="remarks"
              label="Remarks"
              value={values.remarks}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.remarks}
              disabled={isSubmitting}
              placeholder="Enter remarks"
              labelOptional="(Optional)"
            />
            {!isPreview && (
              <div className="flex justify-end gap-4">
                <Button type="submit" className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
                  บันทึก
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  type="reset"
                  onClick={() => {
                    handleReset();
                    setInitialValues({
                      effective_date: data?.effective_date ?? "",
                      part_id: data?.part_id ?? "",
                      price: data?.price ?? null,
                      remarks: data?.remarks ?? "",
                    });
                  }}
                >
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
