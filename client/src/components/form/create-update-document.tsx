import { Base64Helper } from "@/helpers/base64.helper";
import { cn } from "@/lib/utils";
import { useDocument } from "@/services/hooks";
import { TCreateUpdateDocument } from "@/types";
import { FC, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import { PageHeader } from "../common/page-header";
import { Required } from "../common/required";
import { FormField } from "../ui-pattern";
import { InputForm } from "../ui-pattern/form-field/input-form";
import { Button } from "../ui/button";

interface CreateUpdateDocumentProps {
  isTitleVisible?: boolean;
  className?: string;
  data?: Partial<TCreateUpdateDocument>;
  onClose?: () => void;
}

export const CreateUpdateDocument: FC<CreateUpdateDocumentProps> = ({ isTitleVisible, className, data, onClose }) => {
  const base64Helper = new Base64Helper();
  const { mutateCreateDocument, mutateUpdateDocument } = useDocument();
  const [initialValues, setInitialValues] = useState<TCreateUpdateDocument>({
    document_name: data?.document_name ?? "",
    document_data: data?.document_data ?? "",
    document_description: data?.document_description ?? "",
    effective_date: data?.effective_date ?? "",
    expire_date: data?.expire_date ?? "",
  });

  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);

  // Define a validation schema using Yup
  const validationSchema = Yup.object().shape({
    document_name: Yup.string().required("โปรดระบุชื่อ เอกสาร"),
    document_data: Yup.string().required("โปรดอัพโหลดเอกสาร"),
  });

  console.log(acceptedFiles);

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
        ?.getBase64(file)
        ?.then((base64) => {
          console.log(base64);

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

  // Define the submit handler
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);
    if (data) {
      const res = await mutateUpdateDocument({
        ...data,
        ...values,
      });
      setSubmitting(res?.status == "success" ? false : true);
      if (res?.status == "success") {
        onClose && onClose();
      }
    }
    if (!data) {
      const res = await mutateCreateDocument(values);
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
        onSubmit={(e) => console.log(e)}
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
            />

            <div className=" flex flex-col gap-2">
              <label className=" text-sm font-semibold">Document</label>

              <div {...getRootProps()} className="flex flex-col gap-2  ">
                <input {...getInputProps()} />

                <Button variant="secondary" type="button">
                  {data && values.document ? "เปลี่ยนรูปภาพ / Change Image" : "เลือกรูปภาพ / Choose Image"}
                </Button>
                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
              </div>

              <p className=" text-xs text-red-600">{errors.document_name}</p>
            </div>

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
