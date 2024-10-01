import { getTimeSlots } from "@/helpers";
import { FC } from "react";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import { PageHeader } from "../common/page-header";
import { Required } from "../common/required";
import { DateInputForm, InputForm } from "../ui-pattern/form-field/input-form";
import { SelectForm } from "../ui-pattern/form-field/select-form";
import { Button } from "../ui/button";

interface CreateUpdateNgProps {
  isTitleVisible?: boolean;
}

export const CreateUpdateNg: FC<CreateUpdateNgProps> = ({ isTitleVisible = true }) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
  });

  return (
    <div className="relative flex w-full flex-col gap-2 px-4">
      {isTitleVisible && (
        <PageHeader
          title="บันทึกข้อมูล NG"
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
      <form
        className="flex w-full flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          Swal.fire({
            icon: "success",
            title: "บันทึกข้อมูลสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
        }}
        onReset={(e) => {
          e.preventDefault();
        }}
      >
        <DateInputForm label="วันที่ / Date" required type="date" />
        <SelectForm label="ช่วงเวลา / Time" required options={getTimeSlots()} placeholder="เลือกช่วงเวลา" />
        <SelectForm
          label="กระบวนการผลิต / Process"
          placeholder="เลือกกระบวนการผลิต"
          required
          options={[{ label: "Process 1", value: "process-1" }]}
        />
        <SelectForm
          label="ชื่อ Part / Part nam"
          placeholder="เลือก Part No."
          required
          options={[{ label: "NG-1", value: "ng-1" }]}
        />
        <InputForm label="ชื่อกระบวนการ / Process name" required placeholder="โปรดระบุชื่อกระบวนการ" />
        <InputForm label="เครื่องจักร / MC/No." required placeholder="โปรดระบุเครื่องจักร" />
        <InputForm label="ชื่อผู้ปฏิบัติงาน / Operator" required placeholder="โปรดระบุชื่อ Part" />
        <InputForm
          label="จำนวนผลิต / Production Q'ty"
          placeholder="โปรดระบุจำนวนผลิต"
          required
          type="number"
          inputMode="numeric"
        />
        <InputForm
          label="จำนวน NG / NG Q'ty"
          required
          placeholder="โปรดระบุจำนวน NG"
          type="number"
          inputMode="numeric"
        />
        <InputForm
          label="
          ชื่อ พาร์ท หรือ ช็อป / Part or Shop defect"
          placeholder="โปรดระบุชื่อ Part หรือ Shop defect"
          required
        />
        <SelectForm
          label="อาการ / Symptom"
          placeholder="เลือกอาการ"
          required
          options={[{ label: "Process 1", value: "process-1" }]}
        />
        <InputForm
          label="จำนวน Reworked / Reworked Q'ty"
          placeholder="โปรดระบุจำนวน Reworked"
          required
          type="number"
          inputMode="numeric"
        />
        <InputForm
          label="Rework Cost/Unit (Baht)"
          required
          placeholder="โปรดระบุราคา Reworked"
          type="number"
          inputMode="decimal"
        />

        {/* Upload File */}
        <div>
          <label htmlFor="file" className="text-sm font-semibold">
            รูปภาพ / Image
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
          </div>
        </div>

        <div className="flex w-full gap-2">
          <Button className="w-full" type="submit">
            บันทึก / Save
          </Button>
          <Button variant="secondary" className="w-full" type="reset">
            ล้างข้อมูล / Reset
          </Button>
        </div>
      </form>
    </div>
  );
};
