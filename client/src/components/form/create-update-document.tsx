import { Base64Helper } from "@/helpers/base64.helper";
import { cn } from "@/lib/utils";
import { useDocument } from "@/services/hooks";
import { TCreateUpdateDocument } from "@/types";
import { FileText, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import { PageHeader } from "../common/page-header";
import { Required } from "../common/required";
import { FormField } from "../ui-pattern";
import { DateInputForm, InputForm, TextAreaForm } from "../ui-pattern/form-field/input-form";
import { Button } from "../ui/button";

interface CreateUpdateDocumentProps {
  isTitleVisible?: boolean;
  className?: string;
  data?: Partial<TCreateUpdateDocument>;
  onClose?: () => void;
}

export const CreateUpdateDocument: FC<CreateUpdateDocumentProps> = ({ isTitleVisible, className, data, onClose }) => {
  const base64Helper = new Base64Helper();
  const { mutateCreateDocument, mutateUpdateDocument, mutateDeleteDocument } = useDocument();
  const [initialValues, setInitialValues] = useState<TCreateUpdateDocument>({
    document_name: data?.document_name ?? "",
    document_data: data?.document_data ?? "",
    document_description: data?.document_description ?? "",
    effective_date: data?.effective_date ?? "",
    expire_date: data?.expire_date ?? "",
  });

  const validationSchema = Yup.object().shape({
    document_name: Yup.string().required("โปรดระบุชื่อ เอกสาร"),
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [],
      "application/msword": [],
      "application/csv": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1,
    onDrop: (files) => {
      const file = files[0];
      base64Helper
        .getBase64(file)
        .then((base64) => {
          setInitialValues((prevValues) => ({
            ...prevValues,
            document_data: base64,
          }));
        })
        .catch((error) => {
          setInitialValues((prevValues) => ({
            ...prevValues,
            document_data: "",
          }));
          console.error(error);
        });
    },
  });

  // Define the submit handler
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);

    const Values = {
      ...values,
      document_data: initialValues?.document_data === data?.source_file ? null : initialValues?.document_data,
    };

    if (data) {
      const res = await mutateUpdateDocument({
        ...data,
        ...Values,
      });
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
    if (!data) {
      const res = await mutateCreateDocument(Values);
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
  };

  useEffect(() => {
    if (data) {
      setInitialValues({
        document_name: data.document_name ?? "",
        document_data: data.document_data ?? "",
        document_description: data.document_description ?? "",
        effective_date: data.effective_date ?? "",
        expire_date: data.expire_date ?? "",
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
              label="Document name"
              placeholder="โปรดระบุชื่อ เอกสาร"
              name="document_name"
              value={values.document_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.document_name}
              required
            />

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <label className="text-sm font-semibold">Document</label>
                <p className="text-red-500">*</p>
              </div>

              {initialValues?.document_data ? (
                <div className="relative w-min">
                  <FileText size={60} />
                  <X
                    className="absolute right-[-4px] top-[-4px] cursor-pointer rounded-full border-2 border-gray-200 text-gray-200 hover:border-red-500 hover:text-red-500"
                    size={20}
                    onClick={() => setInitialValues({ ...initialValues, document_data: "" })}
                  />
                </div>
              ) : (
                <div {...getRootProps()} className="flex flex-col gap-2 ">
                  <input {...getInputProps()} />

                  <Button variant="secondary" type="button">
                    เลือกเอกสาร / Choose Document
                  </Button>
                </div>
              )}

              <p className=" text-xs text-red-600">{errors.document_data}</p>
            </div>

            <TextAreaForm
              label="Document description"
              placeholder="ระบุคำอธิบายเอกสาร"
              name="document_description"
              value={values.document_description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.document_description}
            />

            <DateInputForm
              label="วันที่มีผลบังคับใช้ / Effective date"
              name="effective_date"
              onPointerDown={(e) => e.stopPropagation()}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.effective_date ?? ""}
              error={errors.effective_date}
            />

            <DateInputForm
              label="วันหมดอายุ / Expiry date"
              name="expire_date"
              onPointerDown={(e) => e.stopPropagation()}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.expire_date ?? ""}
              error={errors.expire_date}
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
