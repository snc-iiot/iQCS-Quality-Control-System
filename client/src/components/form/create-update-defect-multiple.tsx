import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { GET_NOW_TIME_SLOT, GET_TIME_SLOTS } from "@/helpers";
import { Base64Helper } from "@/helpers/base64.helper";
import { renderFormattedPayloadDate } from "@/helpers/date-time.helper";
import { cn } from "@/lib/utils";
import { useDefect } from "@/services/hooks";
import { useAtomStore } from "@/store";
import { TCreateUpdateDefectMultiple } from "@/types";
import { useFormik } from "formik";
import { FC, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { PageHeader } from "../common/page-header";
import { ComboBoxResponsive } from "../ui-pattern";
import { DateInputForm, InputForm, TextAreaForm } from "../ui-pattern/form-field/input-form";
import { SelectForm } from "../ui-pattern/form-field/select-form";
import { Button } from "../ui/button";
import { validationDefectMultipleSchema } from "../validations";
import { CaseMultipleForm } from "./case-multiple-form";
import { CreateUpdatePart } from "./create-update-part";

const initialDefectValues: TCreateUpdateDefectMultiple = {
  defects_log_id: "",
  datetime: "",
  date: renderFormattedPayloadDate(new Date()) ?? "",
  time_slot: GET_NOW_TIME_SLOT(renderFormattedPayloadDate(new Date()) ?? "").value,
  defects_type: "S",
  process_id: "",
  part_id: "",
  defects: [],
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
};

export const CreateUpdateDefectMultiple: FC = () => {
  const { mutateCreateDefectMultiple } = useDefect();
  const base64Helper = new Base64Helper();
  const [modelId, setModelId] = useState<string>("");
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [isOpenAddPart, setIsOpenAddPart] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<TCreateUpdateDefectMultiple>(initialDefectValues);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const { partList, processList, machineList, accountList, ngCauseList, modelList } = useAtomStore();
  const [caseMultipleValues, setCaseMultipleValues] = useState<TCreateUpdateDefectMultiple["defects"]>([
    {
      case_id: "",
      ng_quantity: null,
    },
  ]);
  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      base64Helper
        .getImageBase64(file, 800, 600)
        .then((base64) => {
          setInitialValues((prevValues) => ({ ...prevValues, image: base64 }));
          setAcceptedFiles([]);
        })
        .catch(console.error);
      setAcceptedFiles(files);
    },
    [base64Helper]
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxSize: 8 * 1024 * 1024,
    maxFiles: 1,
    onDrop,
  });

  const getCauseDetail = (causeId: string) => ngCauseList?.find((cause) => cause?.case_id === causeId);

  const { values, handleChange, handleBlur, handleSubmit, errors, setValues } = useFormik({
    initialValues: initialDefectValues,
    validationSchema: validationDefectMultipleSchema,
    validateOnChange: true,
    onSubmit: async (value) => {
      try {
        const dateTime = GET_TIME_SLOTS(value?.date).find((slot) => slot.value == value?.time_slot)?.date_time;
        const payloadImage = initialValues?.image;
        const payload = {
          ...value,
          datetime: dateTime ?? "",
          image: payloadImage,
          defects: caseMultipleValues,
        };
        const res = await mutateCreateDefectMultiple(payload);
        if (res.status == "success") {
          setInitialValues(initialDefectValues);
          setValues(initialDefectValues);
          setCaseMultipleValues([
            {
              case_id: "",
              ng_quantity: null,
            },
          ]);
        }
      } finally {
      }
    },
  });

  useEffect(() => {
    setValues((prevValues) => ({
      ...prevValues,
      part_id: initialValues?.part_id,
    }));
  }, [values?.process_id]);

  useEffect(() => {
    setValues((prevValues) => ({
      ...prevValues,
      defects: initialDefectValues?.defects,
    }));
    setCaseMultipleValues([
      {
        case_id: "",
        ng_quantity: null,
      },
    ]);
  }, [values?.part_id]);

  return (
    <div className={cn("relative flex w-full flex-col gap-2")}>
      <PageHeader
        title="บันทึกข้อมูลแบบหลายอาการ"
        description={
          <div className="flex flex-col gap-1 text-sm">
            <p className="text-muted-foreground">ใช้สำหรับบันทึกข้อมูลการเกิด NG ที่มีอาการมากกว่า 1 อาการ</p>
          </div>
        }
      />
      <form onSubmit={handleSubmit} className="space-y-5">
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
          onChange={handleChange}
          onBlur={handleBlur}
          value={values?.process_id ?? ""}
          error={errors.process_id}
          required
        />
        <SelectForm
          label="Model (ตัวช่วยในการ Filter Part No.)"
          name="model_id"
          placeholder="ทั้งหมด / All"
          options={modelList?.map((model) => ({
            label: model?.model_name,
            value: model?.model_id,
          }))}
          value={modelId}
          onChange={(e) => {
            setModelId(e.target.value);
          }}
        />
        <div>
          <ComboBoxResponsive
            label="Part No."
            options={partList
              ?.filter((model) => {
                if (modelId) {
                  return model?.model_id == modelId;
                }
                return model;
              })
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
              setValues((prevValues) => ({
                ...prevValues,
                part_id: value,
              }));
            }}
            error={errors?.part_id}
            labelFilter="ค้นหา Part No. / Search Part No."
            emptyLabel="เลือก Part No."
            required
          />
          <Button variant="link" className="text-sm text-blue-500" type="button" onClick={() => setIsOpenAddPart(true)}>
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
        {/*//! Select multiple case */}
        <Button variant="outline" type="button" className="w-full" onClick={() => setIsSheetOpen(true)}>
          เลือกอาการ / Select Defect
        </Button>
        {errors?.defects && (
          <p className="text-sm text-red-500">Please select at least one defect / โปรดเลือกอย่างน้อย 1 อาการ</p>
        )}
        {caseMultipleValues.length > 0 && (
          <div>
            <p className="text-sm font-semibold">รายการอาการ / Defect List</p>
            {caseMultipleValues.map((caseValue, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                {getCauseDetail(caseValue?.case_id)?.case_name} - {caseValue?.ng_quantity} ชิ้น
              </p>
            ))}
          </div>
        )}
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
                    เลือกรูปภาพ / Choose Image
                  </Button>
                  {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                </div>
                {initialValues?.image && (
                  <div className="space-y-2">
                    <img src={initialValues?.image ?? ""} alt="image" className="h-48 w-full rounded-md object-cover" />
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
          <Button className="w-full" type="submit">
            บันทึก / Save
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            type="reset"
            onClick={() => {
              setCaseMultipleValues([
                {
                  case_id: "",
                  ng_quantity: null,
                },
              ]);
            }}
          >
            ล้างข้อมูล / Reset
          </Button>
        </div>
      </form>
      <Dialog open={isOpenAddPart} onOpenChange={() => setIsOpenAddPart(false)}>
        <DialogContent className="max-h-[80%] min-h-max overflow-auto">
          <DialogHeader>
            <DialogTitle>เพิ่ม Part / Add Part</DialogTitle>
            <DialogDescription>โปรดกรอกข้อมูลให้ครบถ้วน / Please fill in all required fields</DialogDescription>
          </DialogHeader>
          <CreateUpdatePart onClose={() => setIsOpenAddPart(false)} />
        </DialogContent>
      </Dialog>
      <Sheet open={isSheetOpen} onOpenChange={() => setIsSheetOpen(false)}>
        <SheetContent side="right" style={{ minWidth: "100vw", overflow: "auto" }}>
          <SheetHeader>
            <SheetTitle>เลือกอาการ / Select Defect</SheetTitle>
            <SheetDescription>โปรดเลือกอาการที่เกิดขึ้น / Please select the defect that occurred</SheetDescription>
          </SheetHeader>
          <CaseMultipleForm
            processId={""}
            onSubmit={(value) => {
              setCaseMultipleValues(value?.defects);
              setInitialValues((prevValues) => ({
                ...prevValues,
                defects: value?.defects,
              }));
              setValues((prevValues) => ({
                ...prevValues,
                defects: value?.defects,
              }));
              setIsSheetOpen(false);
            }}
            values={{
              defects: caseMultipleValues,
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
