import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GET_NOW_TIME_SLOT, GET_TIME_SLOTS } from "@/helpers";
import { Base64Helper } from "@/helpers/base64.helper";
import { renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { cn } from "@/lib/utils";
import { useDefect } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TCreateUpdateDefect } from "@/types";
import { FC, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PageHeader } from "../common/page-header";
import { ComboBoxResponsive, FormField } from "../ui-pattern";
import { DateInputForm, InputForm, TextAreaForm } from "../ui-pattern/form-field/input-form";
import { SelectForm } from "../ui-pattern/form-field/select-form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { validationDefectSchema } from "../validations";
import { CreateUpdateCause } from "./create-update-cause";
import { CreateUpdatePart } from "./create-update-part";

interface CreateUpdateNgProps {
  isTitleVisible?: boolean;
  data?: Partial<TCreateUpdateDefect>;
  onClose?: () => void;
  className?: string;
}

export const CreateUpdateDefect: FC<CreateUpdateNgProps> = ({ isTitleVisible = true, data, onClose, className }) => {
  const base64Helper = new Base64Helper();
  const [isOpenAddPart, setIsOpenAddPart] = useState<boolean>(false);
  const [isOpenAddCause, setIsOpenAddCause] = useState<boolean>(false);
  const { mutateCreateDefect, mutateUpdateDefect } = useDefect();
  const { partList, ngCauseList, processList, machineList, accountList } = useAtomStore();
  const [initialValues, setInitialValues] = useState<TCreateUpdateDefect>({
    defects_log_id: data?.defects_log_id || "",
    datetime: data?.datetime || "",
    date: data?.date ?? renderFormattedPayloadDate(new Date()) ?? "",
    time_slot: data?.time_slot || GET_NOW_TIME_SLOT(renderFormattedPayloadDate(new Date()) ?? "").value,
    process_id: data?.process_id || "",
    part_id: data?.part_id || "",
    case_id: data?.case_id || "",
    ng_quantity: data?.ng_quantity || null,
    defects_type: data?.defects_type || "S",

    // Optional
    machine_id: data?.machine_id || "",
    operator_id: data?.operator_id || "",
    production_quantity: data?.production_quantity || null,
    rework_quantity: data?.rework_quantity || null,
    scrap_quantity: data?.scrap_quantity || null,
    claim_supplier_quantity: data?.claim_supplier_quantity || null,
    scrap_approval_sheet_no: data?.scrap_approval_sheet_no || "",
    car_no: data?.car_no || "",
    image: data?.image || "",
    solve_problem: data?.solve_problem || "",
    remarks: data?.remarks || "",
  });
  const [isDeleteImage, setIsDeleteImage] = useState<boolean>(false);
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const resetRef = useRef<HTMLButtonElement>(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 8 * 1024 * 1024, // 8 MB
    maxFiles: 1,
    onDrop: (files) => {
      const file = files[0];
      base64Helper
        ?.getImageBase64(file, 800, 600)
        ?.then((base64) => {
          setInitialValues((prevValues) => ({
            ...prevValues,
            image: base64,
          }));
          setAcceptedFiles([]); // Clear acceptedFiles
        })
        .catch((error) => {
          console.error(error);
        });
      setAcceptedFiles(files); // Update acceptedFiles state
    },
  });
  // Helper function to reset the form values
  const resetFormValues = () => {
    setInitialValues({
      defects_log_id: "",
      datetime: "",
      date: renderFormattedPayloadDate(new Date()) ?? "",
      time_slot: GET_NOW_TIME_SLOT(renderFormattedPayloadDate(new Date()) ?? "").value,
      defects_type: "S",
      process_id: "",
      part_id: "",
      case_id: "",
      ng_quantity: null,

      // Optional
      machine_id: "",
      operator_id: "",
      production_quantity: null,
      rework_quantity: null,
      scrap_quantity: null,
      claim_supplier_quantity: null,
      scrap_approval_sheet_no: "",
      car_no: "",
      image: "",
      solve_problem: "",
      remarks: "",
    });
  };
  // Define the submit handler
  const handleSubmit = async (values: TCreateUpdateDefect, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      const dateTime = GET_TIME_SLOTS(values?.date).find((slot) => slot.value == values?.time_slot)?.date_time;
      const payloadImage =
        !isDeleteImage && initialValues?.image ? initialValues?.image : isDeleteImage ? "DELETE" : null;
      const payload = {
        ...values,
        datetime: dateTime ?? "",
        image: payloadImage,
      };
      const res = data?.defects_log_id ? await mutateUpdateDefect(payload) : await mutateCreateDefect(payload);
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
          title="บันทึกข้อมูล NG"
          description={
            <div className="flex flex-col gap-1 text-sm">
              <p>โปรดกรอกข้อมูลให้ครบถ้วน</p>
            </div>
          }
        />
      )}
      <FormField
        id="defect-form"
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationDefectSchema}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting }) => {
          return (
            <div className="space-y-5">
              <DateInputForm
                label="วันที่ / Date"
                name="date"
                onPointerDown={(e) => e.stopPropagation()}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.date ?? ""}
                error={errors.date}
                required
              />
              <SelectForm
                label="ช่วงเวลา / Time"
                name="time_slot"
                options={GET_TIME_SLOTS(values?.date)}
                placeholder="เลือกช่วงเวลา"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.time_slot ?? ""}
                error={errors.time_slot}
                required
              />
              <SelectForm
                label="กระบวนการผลิต / Process"
                name="process_id"
                placeholder="เลือกกระบวนการผลิต"
                options={processList?.map((process) => ({
                  label: process?.process_name,
                  value: process?.process_id,
                }))}
                onChange={(value) => {
                  handleChange({
                    target: {
                      name: "process_id",
                      value,
                    },
                  });
                  handleChange({
                    target: {
                      name: "part_id",
                      value: "",
                    },
                  });
                }}
                onBlur={handleBlur}
                value={values?.process_id ?? ""}
                error={errors.process_id}
                required
              />
              <div>
                <ComboBoxResponsive
                  label="Part No."
                  options={partList
                    ?.filter((part) => {
                      if (values?.process_id) {
                        return part.processes?.includes(values?.process_id);
                      }
                      return part;
                    })
                    ?.map((part) => ({
                      label: `${part.part_code} - ${part.part_name}`,
                      value: part.part_id,
                    }))}
                  value={values?.part_id ?? ""}
                  onChange={(value) => {
                    handleChange({
                      target: {
                        name: "part_id",
                        value,
                      },
                    });
                  }}
                  error={errors?.part_id}
                  labelFilter="ค้นหา Part No. / Search Part No."
                  emptyLabel="เลือก Part No."
                  required
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
              <SelectForm
                label="ประเภทของ NG / NG Type"
                name="defects_type"
                placeholder="เลือกประเภทของ NG"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.defects_type}
                error={errors.defects_type}
                options={[
                  { label: "Shop", value: "S" },
                  { label: "Part", value: "P" },
                ]}
                required
              />
              <InputForm
                label="Production Q'ty"
                name="production_quantity"
                placeholder="โปรดระบุจำนวน Production Q'ty"
                type="number"
                inputMode="numeric"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values?.production_quantity ?? ""}
                error={errors.production_quantity}
                required
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
                required
              />
              <div>
                <ComboBoxResponsive
                  label="สาเหตุ / Cause"
                  options={ngCauseList
                    ?.filter((ng) => {
                      if (values?.part_id) {
                        return ng?.processes?.includes(values?.process_id);
                      }
                      return ng;
                    })
                    ?.map((ng) => ({
                      label: ng.case_name,
                      value: ng.case_id,
                    }))}
                  value={values?.case_id ?? ""}
                  onChange={(value) => {
                    handleChange({
                      target: {
                        name: "case_id",
                        value,
                      },
                    });
                  }}
                  error={errors?.case_id}
                  labelFilter="ค้นหาสาเหตุ / Search Cause"
                  emptyLabel="เลือกสาเหตุ"
                  required
                />
                <Button
                  variant="link"
                  className="text-sm text-blue-500"
                  type="button"
                  onClick={() => setIsOpenAddCause(true)}
                >
                  เพิ่ม Cause / Add Cause
                </Button>
              </div>

              <Collapsible>
                <CollapsibleTrigger>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">ข้อมูลเพิ่มเติม / Additional Information</span>
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-5 pt-5">
                    <InputForm
                      label="จำนวน Reworked / Reworked Q'ty"
                      name="rework_quantity"
                      placeholder="โปรดระบุจำนวน Reworked"
                      type="number"
                      inputMode="numeric"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.rework_quantity ?? ""}
                      error={errors.rework_quantity}
                      labelOptional="(Optional)"
                    />
                    <InputForm
                      label="จำนวน Scarp / Scarp Q'ty"
                      name="scrap_quantity"
                      placeholder="โปรดระบุจำนวน Scarp"
                      type="number"
                      inputMode="numeric"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.scrap_quantity ?? ""}
                      error={errors.scrap_quantity}
                      labelOptional="(Optional)"
                    />
                    <InputForm
                      label="จำนวน Claim Supplier / Claim Supplier Q'ty"
                      name="claim_supplier_quantity"
                      placeholder="โปรดระบุจำนวน Claim Supplier"
                      type="number"
                      inputMode="numeric"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.claim_supplier_quantity ?? ""}
                      error={errors.claim_supplier_quantity}
                      labelOptional="(Optional)"
                    />
                    <InputForm
                      label="เลขที่ใบอนุมัติ Scrap / Scrap Approval Sheet No."
                      name="scrap_approval_sheet_no"
                      placeholder="โปรดระบุเลขที่ใบอนุมัติ Scrap"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.scrap_approval_sheet_no ?? ""}
                      error={errors.scrap_approval_sheet_no}
                      labelOptional="(Optional)"
                    />
                    <InputForm
                      label="หมายเลข Car / Car No."
                      name="car_no"
                      placeholder="โปรดระบุหมายเลข Car"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.car_no ?? ""}
                      error={errors.car_no}
                      labelOptional="(Optional)"
                    />
                    <div className="space-y-2">
                      <ComboBoxResponsive
                        label="ชื่อเครื่องจักร / Machine Name"
                        labelOptional="(Optional)"
                        options={machineList?.map((machine) => ({
                          label: machine.machine_name,
                          value: machine.machine_id,
                        }))}
                        value={values?.machine_id ?? ""}
                        onChange={(value) => {
                          handleChange({
                            target: {
                              name: "machine_id",
                              value,
                            },
                          });
                        }}
                        error={errors?.machine_id}
                        labelFilter="ค้นหาชื่อเครื่องจักร / Search Machine Name"
                        emptyLabel="เลือกชื่อเครื่องจักร"
                      />
                    </div>
                    <div className="space-y-2">
                      <ComboBoxResponsive
                        label="ชื่อพนักงาน / Operator Name"
                        labelOptional="(Optional)"
                        options={accountList?.map((account) => ({
                          label: account.operator_name,
                          value: account.operator_id,
                        }))}
                        value={values?.operator_id ?? ""}
                        onChange={(value) => {
                          handleChange({
                            target: {
                              name: "operator_id",
                              value,
                            },
                          });
                        }}
                        error={errors?.operator_id}
                        labelFilter="ค้นหาชื่อพนักงาน / Search Operator Name"
                        emptyLabel="เลือกชื่อพนักงาน"
                      />
                    </div>
                    <TextAreaForm
                      label="วิธีแก้ไขปัญหา / Solve Problem"
                      name="solve_problem"
                      placeholder="โปรดระบุวิธีแก้ไขปัญหา"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.solve_problem ?? ""}
                      error={errors.solve_problem}
                      labelOptional="(Optional)"
                    />
                    <TextAreaForm
                      label="หมายเหตุ / Remark"
                      name="remarks"
                      placeholder="โปรดระบุหมายเหตุ"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.remarks ?? ""}
                      error={errors.remarks}
                      labelOptional="(Optional)"
                    />
                    <div className="space-y-2">
                      <label htmlFor="file" className="text-sm font-semibold">
                        รูปภาพ / Image <span className="text-xs text-gray-400">(Optional)</span>
                      </label>
                      {data?.image && (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="delete_image"
                            checked={isDeleteImage}
                            onCheckedChange={(checked) => {
                              const isChecked = checked == true;
                              setIsDeleteImage(isChecked);
                            }}
                          />
                          <label htmlFor="delete_image" className="text-sm text-red-500">
                            ลบรูปภาพที่มีอยู่ / Remove Image
                          </label>
                        </div>
                      )}
                      <div {...getRootProps()} className="flex flex-col gap-2">
                        <input {...getInputProps()} />
                        <div className="flex gap-2">
                          {acceptedFiles.map((file) => (
                            <div key={file.name} className="flex items-center gap-2">
                              <span>{file.name}</span>
                              <span>{file.size / 1000} KB</span>
                            </div>
                          ))}
                        </div>
                        <Button variant="secondary" type="button">
                          {data && data.image ? "เปลี่ยนรูปภาพ / Change Image" : "เลือกรูปภาพ / Choose Image"}
                        </Button>
                        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                      </div>
                      {initialValues?.image && (
                        <div className="space-y-2">
                          <img
                            src={initialValues?.image ?? ""}
                            alt="image"
                            className="h-48 w-full rounded-md object-cover"
                          />
                          <button
                            type="button"
                            className="text-sm text-red-500 hover:underline"
                            onClick={() => {
                              setInitialValues((prevValues) => ({
                                ...prevValues,
                                image: null,
                              }));
                            }}
                          >
                            ลบรูปภาพ / Remove Image
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
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
          );
        }}
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
