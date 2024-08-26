import { CustomSelect } from "@/components/ui/custom-select";
import { ChangeEvent, FC } from "react";
import { FormLayout } from "./form-layout";

export interface Props extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "onCopy"> {
  options: {
    label: string | React.ReactNode;
    value: string;
  }[];
  value?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  label?: string | React.ReactNode;
  afterLabel?: string;
  beforeLabel?: string;
  labelOptional?: string | React.ReactNode;
  descriptionText?: string | React.ReactNode;
  error?: string;
  layout?: "horizontal" | "vertical";
  isRequired?: boolean;
}

export const SelectForm: FC<Props> = ({
  label,
  afterLabel,
  beforeLabel,
  labelOptional,
  descriptionText,
  error,
  layout,
  options,
  value,
  onChange,
  ...rest
}) => {
  return (
    <FormLayout
      {...rest}
      label={label}
      afterLabel={afterLabel}
      beforeLabel={beforeLabel}
      labelOptional={labelOptional}
      descriptionText={descriptionText}
      error={error}
      layout={layout}
      isRequired={rest.required}
    >
      <CustomSelect
        {...rest}
        value={value}
        onChange={(e) => {
          onChange?.(e);
        }}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </CustomSelect>
    </FormLayout>
  );
};
