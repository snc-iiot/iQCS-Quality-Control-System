import { useAtomStore } from "@/store";
import { FormikHelpers, useFormik } from "formik";
import { Trash } from "lucide-react";
import { FC } from "react";
import { ComboBoxResponsive, InputForm } from "../ui-pattern";
import { Button } from "../ui/button";
import { validationCaseMultipleSchema } from "../validations";

interface CaseMultipleFormProps {
  processId: string;
  onSubmit?: (values: FormValues) => void;
  values?: FormValues;
}

interface Defect {
  case_id: string;
  ng_quantity: number | null;
}

interface FormValues {
  defects: Defect[];
}

interface DefectFieldProps {
  defect: Defect;
  index: number;
  ngCaseByProcess: any[];
  onValueSelectChange: (index: number, value: string) => void;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  handleDeleteCase: (index: number) => void;
  errors: any;
}

const DefectField: FC<DefectFieldProps> = ({
  defect,
  index,
  ngCaseByProcess,
  onValueSelectChange,
  handleChange,
  handleBlur,
  handleDeleteCase,
  errors,
}) => (
  <div className="grid grid-cols-2 gap-2">
    <ComboBoxResponsive
      label="อาการ / Symptom"
      options={ngCaseByProcess.map((ng) => ({
        label: ng.case_name,
        value: ng.case_id,
      }))}
      value={defect.case_id}
      onChange={(value) => onValueSelectChange(index, value)}
      labelFilter="ค้นหาอาการ / Search Symptom"
      emptyLabel="เลือกอาการ"
      error={errors?.defects?.[index]?.case_id}
      required
    />
    <div className="flex w-full items-center gap-2">
      <InputForm
        label="จำนวน"
        placeholder="0"
        name={`defects[${index}].ng_quantity`}
        error={errors?.defects?.[index]?.ng_quantity}
        type="number"
        inputMode="numeric"
        value={defect.ng_quantity ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        className="w-full"
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-red-500">ลบ</p>
        <Button
          type="button"
          className="text-sm text-red-500 hover:underline"
          onClick={() => handleDeleteCase(index)}
          variant="outline"
        >
          <Trash size={16} />
        </Button>
        {errors?.defects?.[index] && (
          <p className="text-xs text-white">
            {errors?.defects?.[index]?.case_id || errors?.defects?.[index]?.ng_quantity}
          </p>
        )}
      </div>
    </div>
  </div>
);

export const CaseMultipleForm: FC<CaseMultipleFormProps> = ({ processId, onSubmit, values }) => {
  const { ngCauseList } = useAtomStore();

  const ngCaseByProcess = ngCauseList
    ?.filter((ngCause, index, self) => self.findIndex((t) => t.case_name.trim() === ngCause.case_name.trim()) === index)
    ?.filter((ngCause) => !processId || ngCause.processes.includes(processId));

  const handleAddCase = (setValues: (values: FormValues) => void, currentValues: FormValues) => {
    setValues({
      ...currentValues,
      defects: [...currentValues.defects, { case_id: "", ng_quantity: null }],
    });
  };

  const handleDeleteCase = (index: number, setValues: (values: FormValues) => void, currentValues: FormValues) => {
    setValues({
      ...currentValues,
      defects: currentValues.defects.filter((_, i) => i !== index),
    });
  };

  const handleValueSelectChange = (
    index: number,
    value: string,
    setValues: (values: FormValues) => void,
    currentValues: FormValues
  ) => {
    const updatedDefects = [...currentValues.defects];
    updatedDefects[index].case_id = value;
    setValues({ ...currentValues, defects: updatedDefects });
  };

  const handleSubmitFormik = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    if (onSubmit) onSubmit(values);
    setSubmitting(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: values || { defects: [{ case_id: "", ng_quantity: null }] },
    validationSchema: validationCaseMultipleSchema,
    onSubmit: handleSubmitFormik,
  });

  const { errors, handleChange, handleBlur, handleSubmit, isSubmitting, setValues, values: formikValues } = formik;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formikValues.defects.map((defect, index) => (
        <DefectField
          key={index}
          defect={defect}
          index={index}
          ngCaseByProcess={ngCaseByProcess}
          onValueSelectChange={(idx, value) => handleValueSelectChange(idx, value, setValues, formikValues)}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleDeleteCase={(idx) => handleDeleteCase(idx, setValues, formikValues)}
          errors={errors}
        />
      ))}
      <Button
        type="button"
        className="w-full border border-dashed md:w-max lg:w-max"
        variant="outline"
        onClick={() => handleAddCase(setValues, formikValues)}
      >
        Add Case
      </Button>
      <div className="flex w-full gap-2">
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          บันทึก / Save
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          type="reset"
          onClick={() => {
            const resetValues = { defects: [{ case_id: "", ng_quantity: null }] };
            setValues(resetValues);
          }}
        >
          ล้างข้อมูล / Reset
        </Button>
      </div>
    </form>
  );
};
