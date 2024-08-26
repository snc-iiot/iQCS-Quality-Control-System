import { FormikConfig, useFormik } from "formik";
import { ReactNode, useReducer } from "react";
import { FormContextProvider } from "./form-context";

interface Props extends Omit<FormikConfig<any>, "validateOnMount" | "validateOnChange"> {
  children: (params: any) => ReactNode;
  handleIsSubmitting?: (isSubmitting: boolean) => void;
  handleIsValidating?: (isValidating: boolean) => void;
  name?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

type ErrorAction = {
  key: string;
  error?: string;
};

function errorReducer(state: Record<string, string>, action: ErrorAction) {
  if (action.error) {
    return { ...state, [action.key]: action.error };
  }
  const { [action.key]: _, ...newState } = state;
  return newState;
}

export const FormField = ({ children, validate, handleIsSubmitting, handleIsValidating, ...props }: Props) => {
  const [fieldLevelErrors, dispatchErrors] = useReducer(errorReducer, {});

  function handleFieldLevelValidation(key: string, error?: string) {
    dispatchErrors({ key, error });
  }

  const formik = useFormik({
    validateOnBlur: true,
    validate: validate || (() => fieldLevelErrors),
    ...props,
  });

  return (
    <form
      id={props.id}
      name={props.name}
      onSubmit={formik.handleSubmit}
      className={props.className}
      style={props.style}
      method="POST"
    >
      <FormContextProvider
        values={formik.values}
        errors={formik.errors}
        formContextOnChange={formik.handleChange}
        handleBlur={formik.handleBlur}
        touched={formik.touched}
        fieldLevelValidation={handleFieldLevelValidation}
      >
        {children({
          errors: formik.errors,
          touched: formik.touched,
          isSubmitting: formik.isSubmitting,
          isValidating: formik.isValidating,
          submitCount: formik.submitCount,
          initialValues: formik.initialValues,
          values: formik.values,
          handleReset: formik.handleReset,
          resetForm: formik.resetForm,
          setFieldValue: formik.setFieldValue,
          handleChange: formik.handleChange,
          handleBlur: formik.handleBlur,
          handleSubmit: formik.handleSubmit,
          setFieldError: formik.setFieldError,
          setFieldTouched: formik.setFieldTouched,
          setErrors: formik.setErrors,
          setSubmitting: formik.setSubmitting,
          setTouched: formik.setTouched,
          setValues: formik.setValues,
          validateForm: formik.validateForm,
          validateField: formik.validateField,
          handleIsSubmitting,
          handleIsValidating,
        })}
      </FormContextProvider>
    </form>
  );
};
