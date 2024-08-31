import { cn } from "@/lib/utils";
import { usePriceRatio } from "@/services/hooks/use-price-ratio";
import { TCreateUpdatePriceRatio } from "@/types";
import { FC, useEffect, useState } from "react";
import { PageHeader } from "../common/page-header";
import { FormField } from "../ui-pattern";
import { DateInputForm, InputForm, TextAreaForm } from "../ui-pattern/form-field/input-form";
import { Button } from "../ui/button";
import { validationPriceRatioSchema } from "../validations";

interface ICreateUpdatePriceRatioProps {
  data?: Partial<TCreateUpdatePriceRatio>;
  onClose?: () => void;
  isPreview?: boolean;
  className?: string;
  isTitleVisible?: boolean;
}

export const CreateUpdatePriceRatio: FC<ICreateUpdatePriceRatioProps> = ({
  isTitleVisible,
  className,
  data,
  isPreview = false,
  onClose,
}) => {
  const [initialValues, setInitialValues] = useState<TCreateUpdatePriceRatio>({
    ratio_id: data?.ratio_id ?? "",
    effective_date: data?.effective_date ?? "",
    ng_ratio: data?.ng_ratio ?? null,
    scrap_ratio: data?.scrap_ratio ?? null,
    rework_ratio: data?.rework_ratio ?? null,
    remarks: data?.remarks ?? "",
  });

  const { mutateCreatePriceRatio, mutateUpdatePriceRatio } = usePriceRatio();

  // Define the submit handler
  const handleSubmit = async (
    values: TCreateUpdatePriceRatio,
    {
      setSubmitting,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
    }
  ) => {
    setSubmitting(true);
    if (data) {
      const res = await mutateUpdatePriceRatio({
        ...data,
        ...values,
      });
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
    if (!data) {
      const res = await mutateCreatePriceRatio(values);
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
  };

  useEffect(() => {
    if (data) {
      setInitialValues({
        ratio_id: data.ratio_id,
        effective_date: data.effective_date ?? "",
        ng_ratio: data.ng_ratio ?? null,
        scrap_ratio: data.scrap_ratio ?? null,
        rework_ratio: data.rework_ratio ?? null,
        remarks: data.remarks ?? "",
      });
    }
  }, [data]);

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      {isTitleVisible && (
        <PageHeader
          title="บันทึกข้อมูล Price Ratio"
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
        validationSchema={validationPriceRatioSchema}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting }) => (
          <div className="space-y-5">
            <DateInputForm
              id="effective_date"
              label="วันที่"
              type="date"
              value={values.effective_date}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.effective_date}
              readOnly={isPreview}
              required
            />
            <InputForm
              id="ng_ratio"
              label="NG Ratio"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={values.ng_ratio}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.ng_ratio}
              readOnly={isPreview}
              required
            />
            <InputForm
              id="scrap_ratio"
              label="Scrap Ratio"
              type="number"
              placeholder="0.00"
              inputMode="decimal"
              value={values.scrap_ratio}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.scrap_ratio}
              readOnly={isPreview}
              required
            />
            <InputForm
              id="rework_ratio"
              label="Rework Ratio"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={values.rework_ratio}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.rework_ratio}
              readOnly={isPreview}
              required
            />
            <TextAreaForm
              id="remarks"
              label="หมายเหตุ"
              type="text"
              value={values.remarks}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.remarks}
              readOnly={isPreview}
              placeholder="โปรดระบุหมายเหตุ"
              labelOptional="(Optional)"
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
