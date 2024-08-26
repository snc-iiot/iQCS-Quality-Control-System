import { Checkbox } from "@/components/ui/checkbox";
import { FC } from "react";
import { FormLayout } from "./form-layout";

export interface CheckboxFormProps {
  label?: string;
  descriptionText?: string | React.ReactNode;
  error?: string;
  layout?: "horizontal" | "vertical";
  options: {
    label: string | React.ReactNode;
    value: string;
  }[];
  value?: string[];
  onChange?: (value: string[]) => void;
  afterLabel?: string;
  beforeLabel?: string;
  labelOptional?: string | React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  required?: boolean;
}

const CheckboxItem: FC<{
  id: string;
  option: {
    label: string | React.ReactNode;
    value: string;
  };
  checked: boolean;
  onChange?: (value: string, checked: boolean) => void;
}> = ({ id, option, checked, onChange }) => {
  const handleCheckboxChange = (checked: boolean) => {
    onChange?.(option.value, checked);
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} name={id} value={option.value} checked={checked} onCheckedChange={handleCheckboxChange} />
      <label className="text-sm" htmlFor={id}>
        {option.label}
      </label>
    </div>
  );
};

export const CheckboxForm: FC<CheckboxFormProps> = ({
  label,
  descriptionText,
  error,
  layout = "vertical",
  options,
  value = [],
  onChange,
  ...props
}) => {
  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return;
    const newValue = checked ? [...value, optionValue] : value.filter((v) => v !== optionValue);
    onChange(newValue);
  };

  return (
    <FormLayout
      {...props}
      label={label}
      descriptionText={descriptionText}
      error={error}
      layout={layout}
      isRequired={props.required}
    >
      {options.map((option, i) => (
        <CheckboxItem
          key={i}
          id={`option-${i}`}
          option={option}
          checked={value.includes(option.value)}
          onChange={handleCheckboxChange}
        />
      ))}
    </FormLayout>
  );
};
