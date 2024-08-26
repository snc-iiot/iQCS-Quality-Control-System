import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GET_NOW_TIME_SLOT, GET_TIME_SLOTS } from "@/helpers";
import { PROCESS_LIST } from "@/helpers/common.helper";
import { renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { cn } from "@/lib/utils";
import { useProductivity } from "@/services/hooks/use-productivity";
import { useAtomStore } from "@/store";
import { TCreateUpdateProductivity } from "@/types";
import { FC, useEffect, useRef, useState } from "react";
import { PageHeader } from "../common/page-header";
import { ComboBoxResponsive, FormField } from "../ui-pattern";
import { DateInputForm, InputForm } from "../ui-pattern/form-field/input-form";
import { SelectForm } from "../ui-pattern/form-field/select-form";
import { Button } from "../ui/button";
import { validationProductivitySchema } from "../validations";
import { CreateUpdateCause } from "./create-update-cause";
import { CreateUpdatePart } from "./create-update-part";

interface CreateUpdateProductivityProps {
  isTitleVisible?: boolean;
  data?: Partial<TCreateUpdateProductivity>;
  onClose?: () => void;
  className?: string;
}

export const CreateUpdateProductivity: FC<CreateUpdateProductivityProps> = ({
  isTitleVisible = true,
  data,
  onClose,
  className,
}) => {
  const [isOpenAddPart, setIsOpenAddPart] = useState<boolean>(false);
  const [isOpenAddCause, setIsOpenAddCause] = useState<boolean>(false);
  const { mutateCreateProductivity, mutateUpdateProductivity } = useProductivity();
  const { partList } = useAtomStore();
  const [initialValues, setInitialValues] = useState<TCreateUpdateProductivity>({
    datetime: data?.datetime || "",
    date: data?.date ?? renderFormattedPayloadDate(new Date()) ?? "",
    time_slot: data?.time_slot || GET_NOW_TIME_SLOT(renderFormattedPayloadDate(new Date()) ?? "").value,
    process: data?.process || "",
    part_code: data?.part_code || "",
    quantity: data?.quantity || null,
    ng_quantity: data?.ng_quantity || null,
    machine_name: data?.machine_name || null,
    remarks: data?.remarks || "",
  });
  const resetRef = useRef<HTMLButtonElement>(null);

  // Helper function to reset the form values
  const resetFormValues = () => {
    setInitialValues({
      datetime: "",
      date: "",
      time_slot: "",
      process: "",
      part_code: "",
      quantity: 0,
      ng_quantity: null,
      machine_name: null,
      remarks: "",
    });
  };
  // Define the submit handler
  const handleSubmit = async (values: TCreateUpdateProductivity, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      const dateTime = GET_TIME_SLOTS(values?.date).find((slot) => slot.value == values?.time_slot)?.date_time;
      const payload = {
        ...values,
        datetime: dateTime ?? "",
      };
      const res = data?.prod_log_id ? await mutateUpdateProductivity(payload) : await mutateCreateProductivity(payload);
      if (res.status == "success") {
        onClose?.();
        resetFormValues();
        if (resetRef.current) {
          resetRef.current.click();
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setInitialValues((prevValues) => ({
      ...prevValues,
      ...data,
      image: null,
    }));
  }, [data]);

  return (
    <div className={cn("relative flex w-full flex-col gap-2", className)}>
      {isTitleVisible && (
        <PageHeader
          title="บันทึกข้อมูลยอดการผลิต"
          description={
            <div className="flex flex-col gap-1 text-sm">
              <p>โปรดกรอกข้อมูลให้ครบถ้วน</p>
            </div>
          }
        />
      )}
      <FormField
        id="productivity-form"
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationProductivitySchema}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting }) => (
          <div className="space-y-5">
            <DateInputForm
              label="วันที่ / Date"
              name="date"
              onPointerDown={(e) => e.stopPropagation()}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.date ?? ""}
              error={errors.date}
            />
            <SelectForm
              label="ช่วงเวลา / Time"
              name="time_slot"
              // options={getTimeSlots()}
              options={GET_TIME_SLOTS(values?.date)}
              placeholder="เลือกช่วงเวลา"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.time_slot ?? ""}
              error={errors.time_slot}
            />
            <SelectForm
              label="กระบวนการผลิต / Process"
              name="process"
              placeholder="เลือกกระบวนการผลิต"
              options={PROCESS_LIST?.map((process) => ({
                label: process,
                value: process,
              }))}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.process ?? ""}
              error={errors.process}
            />

            <div>
              <ComboBoxResponsive
                label="Part No."
                options={partList?.map((part) => ({
                  label: `${part.part_code} - ${part.part_name}`,
                  value: part.part_code,
                }))}
                value={values?.part_code ?? ""}
                onChange={(value) => {
                  handleChange({
                    target: {
                      name: "part_code",
                      value,
                    },
                  });
                }}
                error={errors?.part_code}
                labelFilter="ค้นหา Part No. / Search Part No."
                emptyLabel="เลือก Part No."
              />
              <Button
                variant="link"
                className="text-sm text-blue-500"
                type="button"
                onClick={() => setIsOpenAddPart(true)}
              >
                เพิ่ม Part / Add part
              </Button>
            </div>

            <InputForm
              label="จำนวนยอดการผลิต / Productivity Q'ty"
              name="quantity"
              placeholder="โปรดระบุจำนวน Productivity Q'ty"
              type="number"
              inputMode="numeric"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.quantity ?? ""}
              error={errors.quantity}
            />

            <InputForm
              label="ชื่อเครื่องจักร / Machine Name"
              name="machine_name"
              placeholder="โปรดระบุชื่อเครื่อง"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.machine_name ?? ""}
              error={errors.machine_name}
              labelOptional="(Optional)"
            />

            <InputForm
              label="จำนวน NG / NG Q'ty"
              name="ng_quantity"
              placeholder="โปรดระบุจำนวน NG"
              type="number"
              inputMode="numeric"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.ng_quantity ?? ""}
              error={errors.ng_quantity}
              labelOptional="(Optional)"
            />

            <InputForm
              label="หมายเหตุ / Remarks"
              name="remarks"
              placeholder="โปรดระบุหมายเหตุ"
              type="number"
              inputMode="numeric"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.remarks ?? ""}
              error={errors.remarks}
              labelOptional="(Optional)"
            />

            <div className="flex w-full gap-2">
              <Button className="w-full" type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                บันทึก / Save
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                type="reset"
                onClick={() => {
                  handleReset();
                  resetFormValues();
                }}
                ref={resetRef}
              >
                ล้างข้อมูล / Reset
              </Button>
            </div>
          </div>
        )}
      </FormField>

      <Dialog open={isOpenAddPart} onOpenChange={() => setIsOpenAddPart(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่ม Part / Add Part</DialogTitle>
            <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
          </DialogHeader>
          <CreateUpdatePart onClose={() => setIsOpenAddPart(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isOpenAddCause} onOpenChange={() => setIsOpenAddCause(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่ม Cause / Add Cause</DialogTitle>
            <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
          </DialogHeader>
          <CreateUpdateCause onClose={() => setIsOpenAddCause(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
