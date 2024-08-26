import { DateInput } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FC } from "react";
import { FormLayout } from "./form-layout";

export interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onCopy"> {
  inputClassName?: string;
  iconContainerClassName?: string;
  copy?: boolean;
  onCopy?: () => void;
  defaultValue?: string | number;
  descriptionText?: string | React.ReactNode | undefined;
  disabled?: boolean;
  error?: string;
  icon?: any;
  inputRef?: React.LegacyRef<HTMLInputElement>;
  label?: string | React.ReactNode;
  afterLabel?: string;
  beforeLabel?: string;
  labelOptional?: string | React.ReactNode;
  layout?: "horizontal" | "vertical";
  reveal?: boolean;
  actions?: React.ReactNode;
  borderless?: boolean;
  validation?: (x: any) => void;
}
export const InputForm: FC<Props> = (props) => {
  // Destructure the props to separate the ones meant for the FormLayout and Input
  const { label, afterLabel, beforeLabel, labelOptional, descriptionText, error, layout, required, ...inputProps } =
    props;

  return (
    <FormLayout
      label={label}
      afterLabel={afterLabel}
      beforeLabel={beforeLabel}
      labelOptional={labelOptional}
      descriptionText={descriptionText}
      error={error}
      layout={layout}
      isRequired={required}
    >
      <Input {...inputProps} value={props.value ?? ""} />
    </FormLayout>
  );
};

export interface TextAreaProps
  extends Omit<React.InputHTMLAttributes<HTMLTextAreaElement>, "size" | "onCopy" | "labelOptional"> {
  textAreaClassName?: string;
  descriptionText?: string | React.ReactNode | undefined;
  error?: string;
  icon?: any;
  label?: string | React.ReactNode;
  afterLabel?: string;
  beforeLabel?: string;
  labelOptional?: string | React.ReactNode;
  layout?: "horizontal" | "vertical";
  rows?: number;
  limit?: number;
  borderless?: boolean;
  validation?: (x: any) => void;
  copy?: boolean;
  onCopy?: () => void;
  actions?: React.ReactNode;
}

export const TextAreaForm: FC<TextAreaProps> = (props) => {
  const { label, afterLabel, beforeLabel, labelOptional, descriptionText, error, layout, required, ...inputProps } =
    props;

  return (
    <FormLayout
      label={label}
      afterLabel={afterLabel}
      beforeLabel={beforeLabel}
      labelOptional={labelOptional}
      descriptionText={descriptionText}
      error={error}
      layout={layout}
      isRequired={required}
    >
      <Textarea {...inputProps} value={props.value ?? ""} />
    </FormLayout>
  );
};

export const DateInputForm: FC<Props> = (props) => {
  const { label, afterLabel, beforeLabel, labelOptional, descriptionText, error, layout, required, ...inputProps } =
    props;
  return (
    <FormLayout
      label={label}
      afterLabel={afterLabel}
      beforeLabel={beforeLabel}
      labelOptional={labelOptional}
      descriptionText={descriptionText}
      error={error}
      layout={layout}
      isRequired={required}
    >
      <DateInput {...inputProps} value={props.value ?? ""} />
    </FormLayout>
  );
};
