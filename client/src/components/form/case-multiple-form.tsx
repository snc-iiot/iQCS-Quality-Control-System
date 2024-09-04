import { useAtomStore } from "@/store";
import { Formik, FormikHelpers } from "formik";
import { Trash } from "lucide-react";
import { FC, useEffect, useState } from "react";
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

const DefectField: FC<{
  defect: Defect;
  index: number;
  ngCaseByProcess: any[];
  onValueSelectChange: (index: number, value: string) => void;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  handleDeleteCase: (index: number) => void;
  errors: any;
}> = ({ defect, index, ngCaseByProcess, onValueSelectChange, handleChange, handleBlur, handleDeleteCase, errors }) => (
  <div className="grid grid-cols-2 gap-2">
    <ComboBoxResponsive
      label="สาเหตุ / Cause"
      options={ngCaseByProcess.map((ng) => ({
        label: ng.case_name,
        value: ng.case_id,
      }))}
      value={defect.case_id}
      onChange={(value) => onValueSelectChange(index, value)}
      labelFilter="ค้นหาสาเหตุ / Search Cause"
      emptyLabel="เลือกสาเหตุ"
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

  const [initialValues, setInitialValues] = useState<FormValues>({
    defects: [{ case_id: "", ng_quantity: null }],
  });

  const handleAddCase = () => {
    setInitialValues((prevValues) => ({
      ...prevValues,
      defects: [...prevValues.defects, { case_id: "", ng_quantity: null }],
    }));
  };

  const handleDeleteCase = (index: number) => {
    setInitialValues((prevValues) => ({
      ...prevValues,
      defects: prevValues.defects.filter((_, i) => i !== index),
    }));
  };

  const handleValueSelectChange = (index: number, value: string) => {
    setInitialValues((prevValues) => {
      const newDefects = [...prevValues.defects];
      newDefects[index].case_id = value;
      return { ...prevValues, defects: newDefects };
    });
  };

  const handleSubmitFormik = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    if (onSubmit) onSubmit(values);
    setSubmitting(false);
  };

  useEffect(() => {
    if (values) setInitialValues(values);
  }, [values]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationCaseMultipleSchema}
      onSubmit={handleSubmitFormik}
    >
      {({ values, errors, handleChange, handleBlur, handleSubmit, handleReset, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="space-y-5">
          {values.defects.map((defect, index) => (
            <DefectField
              key={index}
              defect={defect}
              index={index}
              ngCaseByProcess={ngCaseByProcess}
              onValueSelectChange={(index, value) => {
                handleValueSelectChange(index, value);
                handleChange({ target: { name: `defects[${index}].case_id`, value } });
              }}
              handleChange={(e) => {
                handleChange(e);
                setInitialValues((prevValues) => {
                  const newDefects = [...prevValues.defects];
                  newDefects[index].ng_quantity = parseInt(e.target.value);
                  return { ...prevValues, defects: newDefects };
                });
              }}
              handleBlur={handleBlur}
              handleDeleteCase={handleDeleteCase}
              errors={errors}
            />
          ))}
          <Button
            type="button"
            className="w-full border border-dashed md:w-max lg:w-max"
            variant="outline"
            onClick={handleAddCase}
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
                handleReset();
                setInitialValues({ defects: [{ case_id: "", ng_quantity: null }] });
              }}
            >
              ล้างข้อมูล / Reset
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};
