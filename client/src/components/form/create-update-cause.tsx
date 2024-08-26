import { PROCESS_LIST } from "@/helpers/common.helper";
import { useNGCause } from "@/services/hooks";
import { TCreateNGCause } from "@/types";
import { FC, useEffect, useState } from "react";
import { FormField } from "../ui-pattern";
import { InputForm, TextAreaForm } from "../ui-pattern/form-field/input-form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { validationCauseSchema } from "../validations";

interface ICreateUpdateCause {
  data?: Partial<TCreateNGCause>;
  onClose?: () => void;
}

export const CreateUpdateCause: FC<ICreateUpdateCause> = ({ data, onClose }) => {
  const { mutateCreateNGCause, mutateUpdateNGCause } = useNGCause();
  const [initialValues, setInitialValues] = useState<TCreateNGCause>({
    ng_id: data?.ng_id || "",
    case_name: data?.case_name || "",
    description: data?.description || "",
    processes: data?.processes || [],
  });

  // Define the submit handler
  const handleSubmit = async (values: TCreateNGCause, { setSubmitting }: any) => {
    try {
      const res = data?.ng_id ? await mutateUpdateNGCause(values) : await mutateCreateNGCause(values);
      if (res?.status == "success") {
        onClose?.();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (data) {
      setInitialValues({
        ng_id: data?.ng_id || "",
        case_name: data?.case_name || "",
        description: data?.description || "",
        processes: data?.processes || [],
      });
    }
  }, [data]);

  return (
    <div className="flex w-full flex-col gap-4">
      <FormField
        id="defect-form"
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationCauseSchema}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting }) => (
          <div className="space-y-5">
            <InputForm
              id="case_name"
              name="case_name"
              label="Case Name"
              value={values.case_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.case_name}
            />
            <TextAreaForm
              id="description"
              name="description"
              label="Description"
              value={values?.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors?.description}
            />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold">Processes</p>
              {PROCESS_LIST?.map((process, i) => (
                <div className="flex items-center gap-2" key={`process-${i}`}>
                  <Checkbox
                    name={process}
                    id={process}
                    checked={values?.processes?.includes(process)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleChange({
                          target: {
                            name: "processes",
                            value: [...values?.processes, process],
                          },
                        });
                      } else {
                        handleChange({
                          target: {
                            name: "processes",
                            value: values?.processes?.filter((p: string) => p !== process),
                          },
                        });
                      }
                    }}
                  />
                  <label htmlFor={process} className="text-sm">
                    {process}
                  </label>
                </div>
              ))}
              {errors?.processes && <p className="text-xs text-red-500">{errors?.processes}</p>}
            </div>
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
                  setInitialValues({
                    ng_id: data?.ng_id || "",
                    case_name: data?.case_name || "",
                    description: data?.description || "",
                    processes: data?.processes || [],
                  });
                }}
              >
                ล้างข้อมูล / Reset
              </Button>
            </div>
          </div>
        )}
      </FormField>
    </div>
  );
};
